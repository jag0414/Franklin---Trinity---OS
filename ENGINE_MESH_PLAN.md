# Self-Optimizing Engine Mesh – Phase 1 Plan

## Objectives
- Dynamically route subtasks to the best-fit engine using live telemetry, cost, and compliance constraints.
- Detect regressions early through continuous evaluation suites.
- Provide transparent registry data for governance + human override.

---

## Components
| Component | Description | Owner |
|-----------|-------------|-------|
| Engine Registry | Source of truth for engines (LLMs, tools, internal skills). Stores metadata, current health, routing weights, compliance tags. | Orchestrator service |
| Telemetry Collector | Emits structured metrics after each engine invocation (latency, token usage, quality flags). | Middleware + result store |
| Evaluator Service | Runs synthetic benchmark suites per skill family to measure accuracy + hallucination risk. | Cron/worker |
| Policy Engine | Applies routing heuristics + reinforcement updates to registry weights. | Planner/Scheduler |
| Governance Dashboard | Visualizes KPI trends, alerts when engines breach thresholds, allows manual overrides. | Ops UI |

---

## Data Contracts
### Engine Registry Item
```jsonc
{
  "id": "openai-gpt-4o",
  "provider": "OpenAI",
  "capabilities": ["reasoning", "code", "vision"],
  "cost_per_1k_tokens": 0.015,
  "latency_p50_ms": 1800,
  "latency_p95_ms": 3100,
  "hallucination_rate": 0.04,
  "pass_rate": 0.92,
  "abstain_rate": 0.06,
  "compliance_tags": ["us", "hipaa"],
  "routing_weight": 0.64,
  "updated_at": "2025-11-20T05:00:00Z"
}
```

### Telemetry Event
```jsonc
{
  "mission_id": "msn_123",
  "task_id": "task_xyz",
  "engine_id": "anthropic-claude-35",
  "latency_ms": 1450,
  "input_tokens": 2100,
  "output_tokens": 640,
  "cost_usd": 0.045,
  "quality_score": 0.88,
  "hallucination_flag": false,
  "user_rating": 5,
  "timestamp": "2025-11-20T05:10:11Z"
}
```

---

## Metrics & Signals
- Latency: p50, p95 per engine + drift vs. SLA.
- Cost: blended cost per mission, per skill class.
- Pass Rate: evaluator success over benchmark set.
- Hallucination Rate: fraction of critic/risk reports per engine.
- Abstain Rate: times engine refuses to answer.
- User Rating: post-mission human score (1–5).
- Token Efficiency: output/input ratio for summarization tasks.

---

## Routing Algorithm (v1)
1. **Filter** engines by compliance tags + capability coverage.
2. **Score** each candidate:
   - `score = w_acc * pass_rate - w_cost * cost_norm - w_lat * latency_norm - w_hall * hallucination_rate + w_user * user_rating_norm`.
3. **Diversity**: ensure no provider exceeds `max_provider_pct` per mission.
4. **Redundancy**: for high-risk tasks, select top-2 engines and run in parallel (A/B or consensus).
5. **Reinforcement Update**: after mission, adjust routing_weight toward engines that achieved high quality at low cost using learning rate `alpha`.
6. **Cooldown**: engines breaching thresholds enter degraded state; scheduler reduces selection probability or disables until recovered.

---

## Telemetry Pipeline
- Middleware publishes `engine.telemetry` events to Redis Stream → Kafka (later) with TTL.
- Prometheus metrics exported for dashboards (`engine_latency_bucket`, `engine_cost_sum`).
- Aggregation job every 5 minutes rolls up stats → registry table.
- Evaluator results stored as `engine_evals` referencing benchmark sets.

---

## Evaluator Strategy
- Maintain benchmark suites per skill (reasoning, legal, code, creative, math).
- Weekly regression runs per engine; nightly spot checks for top routes.
- Synthetic prompts track ground truth answers; automated scoring with deterministic scripts + LLM critiquing for subjective tasks.
- Store deltas vs. previous run; alert when pass rate drops >5%.

---

## Governance & Overrides
- `engine_policies.yaml` declares constraints (region, data class, budget caps).
- Dashboard shows traffic share, SLA breaches, upcoming contract renewals.
- Operators can freeze/unfreeze engines, set manual weight caps, or pin engines for specific clients.
- Audit log records every manual change with operator identity.

---

## Implementation Steps
1. **Week 1**: Define registry schema (Postgres table + Redis cache). Instrument middleware to emit telemetry events.
2. **Week 2**: Build aggregation worker + evaluator scaffolding with initial benchmark seeds.
3. **Week 3**: Implement routing score function + reinforcement update inside planner.
4. **Week 4**: Ship dashboard widgets + governance policies file, integrate alerts (PagerDuty/Slack).

---

## Open Questions
1. Do we need per-client weighting profiles (custom scoring weights)?
2. Should evaluators run on dedicated isolated accounts to avoid biasing production limits?
3. How do we store sensitive telemetry (token counts) for regulated clients—masking or aggregate only?
