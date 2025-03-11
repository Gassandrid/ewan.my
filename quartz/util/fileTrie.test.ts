import test, { describe, beforeEach } from "node:test"
import assert from "node:assert"
import { FileTrieNode } from "./fileTrie"

interface TestData {
  title: string
  slug: string
}

describe("FileTrie", () => {
  let trie: FileTrieNode<TestData>

  beforeEach(() => {
    trie = new FileTrieNode<TestData>([])
  })

  describe("constructor", () => {
    test("should create an empty trie", () => {
      assert.deepStrictEqual(trie.children, [])
      assert.strictEqual(trie.slug, "")
      assert.strictEqual(trie.displayName, "")
      assert.strictEqual(trie.data, null)
    })

    test("should set displayName from data title", () => {
      const data = {
        title: "Test Title",
        slug: "test",
      }

      trie.add(data)
      assert.strictEqual(trie.children[0].displayName, "Test Title")
    })
  })

  describe("add", () => {
    test("should add a file at root level", () => {
      const data = {
        title: "Test",
        slug: "test",
      }

      trie.add(data)
      assert.strictEqual(trie.children.length, 1)
      assert.strictEqual(trie.children[0].slug, "test")
      assert.strictEqual(trie.children[0].data, data)
    })

    test("should handle index files", () => {
      const data = {
        title: "Index",
        slug: "index",
      }

      trie.add(data)
      assert.strictEqual(trie.data, data)
      assert.strictEqual(trie.children.length, 0)
    })

    test("should add nested files", () => {
      const data1 = {
        title: "Nested",
        slug: "folder/test",
      }

      const data2 = {
        title: "Really nested index",
        slug: "a/b/c/index",
      }

      trie.add(data1)
      trie.add(data2)
      assert.strictEqual(trie.children.length, 2)
      assert.strictEqual(trie.children[0].slug, "folder/index")
      assert.strictEqual(trie.children[0].children.length, 1)
      assert.strictEqual(trie.children[0].children[0].slug, "folder/test")
      assert.strictEqual(trie.children[0].children[0].data, data1)

      assert.strictEqual(trie.children[1].slug, "a/index")
      assert.strictEqual(trie.children[1].children.length, 1)
      assert.strictEqual(trie.children[1].data, null)

      assert.strictEqual(trie.children[1].children[0].slug, "a/b/index")
      assert.strictEqual(trie.children[1].children[0].children.length, 1)
      assert.strictEqual(trie.children[1].children[0].data, null)

      assert.strictEqual(trie.children[1].children[0].children[0].slug, "a/b/c/index")
      assert.strictEqual(trie.children[1].children[0].children[0].data, data2)
      assert.strictEqual(trie.children[1].children[0].children[0].children.length, 0)
    })
  })

  describe("filter", () => {
    test("should filter nodes based on condition", () => {
      const data1 = { title: "Test1", slug: "test1" }
      const data2 = { title: "Test2", slug: "test2" }

      trie.add(data1)
      trie.add(data2)

      trie.filter((node) => node.slug !== "test1")
      assert.strictEqual(trie.children.length, 1)
      assert.strictEqual(trie.children[0].slug, "test2")
    })
  })

  describe("map", () => {
    test("should apply function to all nodes", () => {
      const data1 = { title: "Test1", slug: "test1" }
      const data2 = { title: "Test2", slug: "test2" }

      trie.add(data1)
      trie.add(data2)

      trie.map((node) => {
        if (node.data) {
          node.data.title = "Modified"
        }
      })

      assert.strictEqual(trie.children[0].displayName, "Modified")
      assert.strictEqual(trie.children[1].displayName, "Modified")
    })
  })

  describe("entries", () => {
    test("should return all entries", () => {
      const data1 = { title: "Test1", slug: "test1" }
      const data2 = { title: "Test2", slug: "a/b/test2" }

      trie.add(data1)
      trie.add(data2)

      const entries = trie.entries()
      assert.deepStrictEqual(
        entries.map(([path, node]) => [path, node.data]),
        [
          ["index", trie.data],
          ["test1", data1],
          ["a/index", null],
          ["a/b/index", null],
          ["a/b/test2", data2],
        ],
      )
    })
  })

  describe("getFolderPaths", () => {
    test("should return all folder paths", () => {
      const data1 = {
        title: "Root",
        slug: "index",
      }
      const data2 = {
        title: "Test",
        slug: "folder/subfolder/test",
      }
      const data3 = {
        title: "Folder Index",
        slug: "abc/index",
      }

      trie.add(data1)
      trie.add(data2)
      trie.add(data3)
      const paths = trie.getFolderPaths()

      assert.deepStrictEqual(paths, [
        "index",
        "folder/index",
        "folder/subfolder/index",
        "abc/index",
      ])
    })
  })

  describe("sort", () => {
    test("should sort nodes according to sort function", () => {
      const data1 = { title: "A", slug: "a" }
      const data2 = { title: "B", slug: "b" }
      const data3 = { title: "C", slug: "c" }

      trie.add(data3)
      trie.add(data1)
      trie.add(data2)

      trie.sort((a, b) => a.slug.localeCompare(b.slug))
      assert.deepStrictEqual(
        trie.children.map((n) => n.slug),
        ["a", "b", "c"],
      )
    })
  })
})
