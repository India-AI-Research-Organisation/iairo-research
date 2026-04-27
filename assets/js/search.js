/**
 * Modular Lunr search for Jekyll projects.
 * Requires: lunr.js and /search.json endpoint.
 */
(function () {
  "use strict";

  var MAX_RESULTS = 8;
  var FULL_RESULTS_LIMIT = 100;
  var MIN_QUERY_LENGTH = 2;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function buildLunrQuery(raw) {
    return raw
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(function (term) {
        return term + "*";
      })
      .join(" ");
  }

  function getQueryTerms(query) {
    return query
      .toLowerCase()
      .split(/\s+/)
      .map(function (term) {
        return term.trim();
      })
      .filter(function (term) {
        return term.length >= MIN_QUERY_LENGTH;
      });
  }

  function escapeForRegex(term) {
    return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlightText(text, query) {
    var safe = escapeHtml(text || "");
    var terms = getQueryTerms(query);

    if (!terms.length) {
      return safe;
    }

    terms.forEach(function (term) {
      var pattern = new RegExp("(" + escapeForRegex(term) + ")", "ig");
      safe = safe.replace(pattern, "<mark>$1</mark>");
    });

    return safe;
  }

  function readQueryParam() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("q") || "").trim();
  }

  function createSearchModule() {
    var form = document.querySelector(".wiki-search");
    var input = document.getElementById("wiki-search-input");
    var resultsPanel = document.getElementById("wiki-search-results");

    if (!form || !input || !resultsPanel) {
      return null;
    }

    var indexUrl = input.getAttribute("data-index-url") || "/search.json";
    var docs = [];
    var docMap = {};
    var index = null;
    var activeIndex = -1;
    var currentMatches = [];

    var fullSummary = document.getElementById("wiki-full-search-summary");
    var fullResults = document.getElementById("wiki-full-search-results");

    function hideResults() {
      resultsPanel.hidden = true;
      resultsPanel.innerHTML = "";
      activeIndex = -1;
      currentMatches = [];
    }

    function showMessage(message) {
      resultsPanel.hidden = false;
      resultsPanel.innerHTML = '<p class="wiki-search-meta">' + escapeHtml(message) + "</p>";
    }

    function buildSearchResultsUrl(query) {
      var url = input.getAttribute("data-results-url") || "/search/";
      return url + "?q=" + encodeURIComponent(query);
    }

    function activateDropdownItem(indexToActivate) {
      var items = resultsPanel.querySelectorAll(".wiki-search-item");
      items.forEach(function (item, idx) {
        if (idx === indexToActivate) {
          item.classList.add("is-active");
        } else {
          item.classList.remove("is-active");
        }
      });
    }

    function renderResults(matches, totalCount, query) {
      if (!matches.length) {
        showMessage("No matching projects found.");
        return;
      }

      currentMatches = matches;
      activeIndex = -1;

      var html =
        '<p class="wiki-search-meta">' +
        escapeHtml(String(totalCount) + " result" + (totalCount === 1 ? "" : "s")) +
        ' · <a href="' +
        escapeHtml(buildSearchResultsUrl(query)) +
        '">View all</a>' +
        "</p>" +
        '<ul class="wiki-search-list">';

      matches.forEach(function (match) {
        var doc = docMap[match.ref];
        if (!doc) {
          return;
        }

        html +=
          '<li class="wiki-search-item" data-ref="' +
          escapeHtml(match.ref) +
          '">' +
          '<a class="wiki-search-title" href="' +
          escapeHtml(doc.url) +
          '">' +
          highlightText(doc.title || "Untitled project", query) +
          "</a>" +
          '<p class="wiki-search-snippet">' +
          highlightText(doc.area || "General", query) +
          (doc.summary ? " - " + highlightText(doc.summary, query) : "") +
          "</p>" +
          "</li>";
      });

      html += "</ul>";
      resultsPanel.hidden = false;
      resultsPanel.innerHTML = html;
    }

    function doSearch() {
      if (!index) {
        showMessage("Search index is still loading.");
        return;
      }

      var query = input.value.trim();

      if (query.length < MIN_QUERY_LENGTH) {
        hideResults();
        return;
      }

      var lunrQuery = buildLunrQuery(query);
      var rawResults = [];

      try {
        rawResults = index.search(lunrQuery);
      } catch (error) {
        rawResults = index.search(query);
      }

      renderResults(rawResults.slice(0, MAX_RESULTS), rawResults.length, query);
    }

    function moveSelection(direction) {
      if (!currentMatches.length) {
        return;
      }

      activeIndex += direction;

      if (activeIndex < 0) {
        activeIndex = currentMatches.length - 1;
      }

      if (activeIndex >= currentMatches.length) {
        activeIndex = 0;
      }

      activateDropdownItem(activeIndex);
    }

    function goToSelectedOrResults() {
      var query = input.value.trim();

      if (activeIndex >= 0 && currentMatches[activeIndex]) {
        var selected = docMap[currentMatches[activeIndex].ref];
        if (selected && selected.url) {
          window.location.href = selected.url;
          return;
        }
      }

      if (query.length >= MIN_QUERY_LENGTH) {
        window.location.href = buildSearchResultsUrl(query);
      }
    }

    function renderFullResults(matches, query) {
      if (!fullSummary || !fullResults) {
        return;
      }

      if (query.length < MIN_QUERY_LENGTH) {
        fullSummary.textContent = "Type at least 2 characters to search projects.";
        fullResults.innerHTML = "";
        return;
      }

      fullSummary.textContent = matches.length + " result" + (matches.length === 1 ? "" : "s") + " for \"" + query + "\"";

      if (!matches.length) {
        fullResults.innerHTML = '<li class="wiki-full-search-item">No matching projects found.</li>';
        return;
      }

      var html = "";
      matches.slice(0, FULL_RESULTS_LIMIT).forEach(function (match) {
        var doc = docMap[match.ref];
        if (!doc) {
          return;
        }

        html +=
          '<li class="wiki-full-search-item">' +
          '<a class="wiki-full-search-title" href="' +
          escapeHtml(doc.url) +
          '">' +
          highlightText(doc.title || "Untitled project", query) +
          "</a>" +
          '<p class="wiki-full-search-meta">' +
          highlightText(doc.area || "General", query) +
          (doc.duration ? " · " + escapeHtml(doc.duration) : "") +
          "</p>" +
          '<p class="wiki-full-search-snippet">' +
          highlightText(doc.summary || "", query) +
          "</p>" +
          "</li>";
      });

      fullResults.innerHTML = html;
    }

    function initFullResultsPage() {
      if (!fullSummary || !fullResults || !index) {
        return;
      }

      var query = readQueryParam();
      if (query) {
        input.value = query;
      }

      if (query.length < MIN_QUERY_LENGTH) {
        renderFullResults([], query);
        return;
      }

      var lunrQuery = buildLunrQuery(query);
      var results = [];

      try {
        results = index.search(lunrQuery);
      } catch (error) {
        results = index.search(query);
      }

      renderFullResults(results, query);
    }

    function bindEvents() {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        goToSelectedOrResults();
      });

      input.addEventListener("input", doSearch);

      input.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          moveSelection(1);
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          moveSelection(-1);
        }

        if (event.key === "Escape") {
          hideResults();
          input.blur();
        }

        if (event.key === "Enter") {
          event.preventDefault();
          goToSelectedOrResults();
        }
      });

      document.addEventListener("click", function (event) {
        if (!form.contains(event.target)) {
          hideResults();
        }
      });

      input.addEventListener("focus", function () {
        if (input.value.trim().length >= MIN_QUERY_LENGTH) {
          doSearch();
        }
      });
    }

    function buildIndex(records) {
      docs = records;
      docMap = {};

      docs.forEach(function (doc) {
        docMap[String(doc.id)] = doc;
      });

      index = lunr(function () {
        this.ref("id");
        this.field("title", { boost: 12 });
        this.field("area", { boost: 6 });
        this.field("summary", { boost: 4 });
        this.field("content");

        docs.forEach(function (doc) {
          this.add(doc);
        }, this);
      });
    }

    function init() {
      if (typeof lunr === "undefined") {
        showMessage("Search library failed to load.");
        return;
      }

      bindEvents();
      showMessage("Loading search index...");

      fetch(indexUrl)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Failed to load search index");
          }
          return response.json();
        })
        .then(function (records) {
          buildIndex(records || []);
          hideResults();
          initFullResultsPage();
        })
        .catch(function () {
          showMessage("Could not load search index.");
        });
    }

    return {
      init: init,
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    var module = createSearchModule();
    if (module) {
      module.init();
      window.WikiProjectSearch = module;
    }
  });
})();
