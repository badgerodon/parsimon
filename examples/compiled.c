#include <stdio.h>
#include <gc.h>

int cmp(void* key1, void* key2) {
  return strcmp(key1, key2);
}

struct Node {
  struct Node* left;
  struct Node* right;
  void* key;
  void* value;
};

struct Tree {
  struct Node* root;
  int size;
};

struct Tree* Tree_new() {
  struct Tree* t = (struct Tree*)GC_MALLOC(sizeof(struct Tree));
  t->size = 0;
  return t;
}
void* Tree_get(struct Tree* tree, void* key) {
  struct Node* node = tree->root;
  while (node != NULL) {
    int c = cmp(node->key, key);
    if (c == 1) {
      node = node->right;
    } else if (c == -1) {
      node = node->left;
    } else {
      return node->value;
    }
  }
  return NULL;
}
void Tree_set(struct Tree* tree, void* key, void* value) {
  if (tree->size == 0) {
    tree->root = (struct Node*)GC_MALLOC(sizeof(struct Node));
    tree->root->key = key;
    tree->root->value = value;
    tree->size++;
  } else {
    struct Node* node = tree->root;
    while (node != NULL) {
      int c = cmp(node->key, key);
      if (c == 1) {
        node = node->right;
      } else if (c == -1) {
        node = node->left;
      } else {
        break;
      }
    }
    if (node != NULL) {
      node->key = key;
      node->value = value;
      tree->size++;
    }
  }
}

int main(void) {
  GC_INIT();

  double* d = (double*)GC_MALLOC(sizeof(double));
  (*d) = 15.7558;

  struct Tree* t = Tree_new();
  Tree_set(t, "test", d);

  printf("Size: %d, test: %f", t->size, *(double*)Tree_get(t, "test"));
  printf("\n");

  return 0;
}