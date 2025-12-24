/**
 * defaults.ts
 * ------------------------------------------------------------
 * Central location for default application state.
 *
 * RESPONSIBILITY
 * - Define default filter criteria
 * - Define default TX parameters
 *
 * CONVENTIONS
 * - Constants only
 * - No functions
 *
 * ALLOWED
 * - Typed objects
 *
 * NOT ALLOWED
 * - Logic
 * - Side effects
 *
 * DESIGN GOAL
 * - Defaults must be reusable across app
 * - Prevent duplication and drift
 */

import type { FilterCriteria, TxParams } from "@/types";

export const defaultCriteria: FilterCriteria = {
  service_name: "",
  service_id: "",
  src: "",
  dst: "",
  cmd_class: "",
  direction: "",
  attribute: "",
  feature: "",
  payload: "",
  error: "",
  text_search: "",
  time_from_enable: false,
  time_to_enable: false,
  time_from: undefined,
  time_to: undefined,
  severity_mode: "any",
};

export const defaultTx: TxParams = {
  iface_tx: "can0",
  cmd_class: 0,
  broadcast: false,
  dst: 0,
  src: 0,
  s_bit: false,
  e_bit: false,
  t_bit: false,
  service_id: 0,
  attr_addr: 0,
  msg_good: true,
  instance: 0,
  feature: 0,
  payload_hex: "",
  arb_hex: "",
  data_hex: "",
  umi: "",
  iface_sim: "can0",
  interval_sim: 1000,
  sim_running: false,
};
