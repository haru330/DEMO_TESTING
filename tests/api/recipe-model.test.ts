import { afterEach, describe, expect, it } from "vitest";
import { createFakeRecipeModel, getRecipeModel, setRecipeModel } from "@/lib/recipes/model-client";

afterEach(() => setRecipeModel(null));

describe("recipe model seam", () => {
  it("lets a test replace the model and see what it was asked", async () => {
    const { model, calls } = createFakeRecipeModel('{"recipes":[]}');
    setRecipeModel(model);

    const input = { items: [{ name: "eggs", stockLevel: "some" as const }], staples: ["salt"] };
    const reply = await getRecipeModel().generate(input);

    expect(reply).toBe('{"recipes":[]}');
    expect(calls).toEqual([input]);
  });

  it("refuses to call a real model when none is configured", () => {
    expect(() => getRecipeModel()).toThrow("No recipe model configured");
  });
});
