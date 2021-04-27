import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";

import axios from "axios";

jest.mock("axios");

axios.get.mockResolvedValue({ data: "mock data" });

describe("Home test", () => {
  let w;

  beforeEach(() => {
    w = shallowMount(Home);
  });

  it("mounted", async () => {
    // const w = shallowMount(Home);
    expect(w.exists()).toBe(true);
  });

  // it("datepicker", () => {
  //   expect(w.find("#datepicker1").exists()).toBe(true);
  //   expect(w.find("#datepicker2").exists()).toBe(true);
  // });

  // it("chart", () => {
  //   expect(w.find("#chart").exists()).toBe(true);
  // });

  // it("table", () => {
  //   const table = w.find("#table");
  //   expect(table.exists()).toBe(true);
  // });

  // it("credit", () => {
  //   expect(w.find("#credit").exists()).toBe(true);
  // });
});
