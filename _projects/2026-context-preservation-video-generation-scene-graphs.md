---
title: "Context Preservation in Long-Form Video Generation via Scene Graphs"
summary: Scene-graph-conditioned video continuation to reduce context drift, hallucination, and identity loss in long-form generation.
area: Computer Vision / Video Generation
status: active
featured: false
duration: 2026 - Present
order: 20
paper_key: context-preservation-scene-graphs
---

This project investigates video continuation for long-form generation by using scene graphs as a training-free structural anchor. The goal is to reduce exposure-bias-driven drift, preserve object identity, and maintain relational consistency across continuously generated frames.

## Project Motive

Autoregressive and diffusion-based video models often drift over time because they must rely on their own generated outputs during inference. That mismatch between training and generation leads to context loss, scene hallucination, and degraded temporal consistency.

## Method

- Extract scene graphs from reference frames using ImPartial, extending the structural ideas behind DiffVSGG.
- Translate discrete graph nodes and edges into continuous embeddings with GNN-based encoders.
- Inject the graph representation into Wan 2.1 (1.3B) through cross-attention LoRA modules while freezing the base model weights.
- Use the graph-conditioned latent representation to guide video continuation and preserve spatial and relational logic.

## Evaluation

The project will be evaluated on a small benchmark of roughly 50 examples using:

- Physics Validation / Google Physics-IQ for object permanence and spatial integrity.
- Motion Aware Warp Error (MAWE) for motion fidelity without structural collapse.
- Scene Cuts (SCuts) for long-range temporal consistency.
- FVD and CLIP Score as standard visual quality and text-alignment baselines.

## Status

The work is in progress, with the current focus on graph extraction, continuous graph translation, and conditioning strategy design for Wan 2.1.