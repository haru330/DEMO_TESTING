// The one place the app talks to the AI model. Tests swap in a fake via setRecipeModel.

export type RecipeModelInput = {
  items: { name: string; stockLevel: "plenty" | "some" | "low" }[];
  staples: string[];
  note?: string;
};

export interface RecipeModel {
  /** Returns the model's raw reply; the caller validates it. */
  generate(input: RecipeModelInput): Promise<string>;
}

let current: RecipeModel | null = null;

export function setRecipeModel(model: RecipeModel | null) {
  current = model;
}

export function getRecipeModel(): RecipeModel {
  if (!current) throw new Error("No recipe model configured");
  return current;
}

/** A fake that returns a canned reply and records what it was asked. */
export function createFakeRecipeModel(reply: string | (() => string | Promise<string>)) {
  const calls: RecipeModelInput[] = [];
  const model: RecipeModel = {
    async generate(input) {
      calls.push(input);
      return typeof reply === "function" ? reply() : reply;
    },
  };
  return { model, calls };
}
