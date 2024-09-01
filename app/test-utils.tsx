// Ref: https://testing-library.com/docs/react-testing-library/setup
import "@testing-library/jest-dom/vitest";
import React, { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export const setup = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllTheProviders, ...options }),
  };
};

export * from "@testing-library/react";
