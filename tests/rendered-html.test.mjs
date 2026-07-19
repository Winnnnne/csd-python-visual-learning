import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders metadata for CSD Python Visual Learning", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>CSD Python Visual Learning<\/title>/i);
  assert.match(html, /Học cấu trúc dữ liệu và giải thuật bằng mô phỏng trực quan/i);
  assert.match(html, /og\.png/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("ships the complete MVP content and removes the starter preview", async () => {
  const [data, packageJson, page, layout] = await Promise.all([
    readFile(new URL("../app/data/learning-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.equal((data.match(/^    slug: /gm) ?? []).length, 6);
  assert.equal((data.match(/exercise\(/g) ?? []).length, 18);
  assert.equal((data.match(/quiz\(/g) ?? []).length, 30);
  assert.match(page, /<CsdApp \/>/);
  assert.match(layout, /lang="vi"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../README.md", import.meta.url));
  assert.match(packageJson, /csd-python-visual-learning/);
  assert.match(data, /tail\.next = head/);
  assert.match(data, /in-order successor/i);
  assert.match(data, /class BinarySearchTree/);
  assert.match(data, /class StackWithList/);
  assert.match(data, /class LinkedQueue/);
  assert.match(data, /class DoublyLinkedList/);
  assert.match(data, /class CircularLinkedList/);
  assert.match(data, /class SinglyLinkedList/);
  assert.match(data, /Python/);
  assert.doesNotMatch(data, /class\s+\w+\s*\{\s*public|#include|System\.out/);
  assert.match(packageJson, /react-router-dom/);
  assert.match(packageJson, /framer-motion/);
  assert.match(packageJson, /lucide-react/);
  assert.match(layout, /og\.png/);
  assert.doesNotMatch(layout, /Starter Project/);
  assert.doesNotMatch(page, /SkeletonPreview/);
  assert.doesNotMatch(packageJson, /codex-preview/);
  assert.match(data, /Singly Linked List/);
  assert.match(data, /Binary Search Tree/);
  assert.match(data, /Stack/);
  assert.match(data, /Queue/);
});
