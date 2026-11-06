import { describe, expect, it } from "vitest";
import { clearSearchFilters, parseSearchParams, serializeSearchQuery, updateSearchQuery, validatePriceRange } from "./search-params";

const parse = (value = "") => parseSearchParams(new URLSearchParams(value));

describe("price validation", () => {
  it.each([
    ["", "", undefined, undefined],
    ["0", "0", 0, 0],
    [" 100 ", "200.5", 100, 200.5],
    ["", "100", undefined, 100],
    ["100", "", 100, undefined],
    [".5", "1e3", 0.5, 1000],
  ])("accepts minimum %s and maximum %s", (min, max, expectedMin, expectedMax) => {
    expect(validatePriceRange(min, max)).toEqual({ valid: true, min: expectedMin, max: expectedMax });
  });

  it.each(["-1", "NaN", "Infinity", "1e309", "0x10", "abc", "9007199254740992"])("rejects invalid numeric value %s", (value) => {
    expect(validatePriceRange(value, "").valid).toBe(false);
    expect(validatePriceRange("", value).valid).toBe(false);
  });

  it("rejects an inverted range with an actionable message", () => {
    expect(validatePriceRange("200", "100")).toEqual({ valid: false, message: "最低價不可高於最高價" });
  });
});

describe("URL query contract", () => {
  it("provides stable defaults without inventing a search term", () => {
    expect(parse()).toEqual({ q: "", category: "", brand: "", min: undefined, max: undefined, sort: "recommended", page: 1 });
    expect(serializeSearchQuery(parse())).toBe("");
  });

  it("normalizes spacing and full-width text while retaining a zero minimum", () => {
    const params = new URLSearchParams({ q: "  iPhone　１７  Pro  ", brand: " HODA ", min: "0", max: "2000", sort: "price-desc", page: "02" });
    const query = parseSearchParams(params);
    expect(query).toEqual({ q: "iPhone 17 Pro", category: "", brand: "HODA", min: 0, max: 2000, sort: "price-desc", page: 2 });
    expect(serializeSearchQuery(query)).toBe("q=iPhone+17+Pro&brand=HODA&min=0&max=2000&sort=price-desc&page=2");
  });

  it.each(["0", "-1", "1.5", "1e3", "NaN", "Infinity", "9007199254740992"])("normalizes invalid page %s", (page) => {
    expect(parse(`page=${page}`).page).toBe(1);
  });

  it("drops an invalid URL range and falls back from an unknown sort", () => {
    expect(parse("min=200&max=100&sort=unknown")).toMatchObject({ min: undefined, max: undefined, sort: "recommended" });
  });

  it.each(["手機 & 配件+殼", "1e-7"])("round-trips encoded input %s", (value) => {
    const query = value === "1e-7" ? parse(`min=${value}`) : parseSearchParams(new URLSearchParams({ q: value, category: "手機配件", brand: "未知品牌" }));
    expect(parse(serializeSearchQuery(query))).toEqual(query);
  });

  it("does not modify the caller's URLSearchParams", () => {
    const params = new URLSearchParams("q=+iphone++&page=-1");
    const before = params.toString();
    parseSearchParams(params);
    expect(params.toString()).toBe(before);
  });
});

describe("query transitions", () => {
  const current = parse("q=iphone&category=手機配件&brand=HODA&min=0&max=2000&sort=price-desc&page=2");

  it("changes page without dropping filters", () => {
    expect(updateSearchQuery(current, { page: 3 })).toEqual({ ...current, page: 3 });
  });

  it.each([
    { q: "UAG" }, { category: "手機" }, { category: "" }, { brand: "Apple" }, { min: 100 }, { max: undefined }, { sort: "price-asc" as const },
  ])("resets the page when a filter changes: %o", (patch) => {
    const result = updateSearchQuery(current, patch);
    expect(result).toEqual({ ...current, ...patch, page: 1 });
    expect(current.page).toBe(2);
  });

  it("does not reset the page for semantically unchanged input", () => {
    expect(updateSearchQuery(current, { q: "  iphone  " })).toEqual(current);
  });

  it("clears filters but preserves the committed keyword", () => {
    expect(clearSearchFilters(current)).toEqual({ q: "iphone", category: "", brand: "", min: undefined, max: undefined, sort: "recommended", page: 1 });
  });
});
