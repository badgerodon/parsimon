#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <gc.h>

// Structs
struct Value {
  uint64_t kind;
  uint64_t value;
};
struct Field {
  uint64_t symbol;
  struct Value value;
}
struct Array {
  uint64_t length;
  struct Field* fields;
}

void get(struct Value* value, uint64_t symbol, struct Value* result) {
  if (value->kind == 8) {
    if (symbol == 0) {
      (*result) = ((struct S0*)(void*)value->value)->x;
    }
  }
}

int main(void) {
  GC_INIT();
  
  return 0;
}

/*


// Reflection types
struct Record {
  struct Integer size;
  struct Array properties;
};
struct Record* records;

// Any.to_any
struct Any f1(struct Any this) {
  return this;
}

// Boolean.to_any
struct Any f2(struct Boolean this) {

}

int main(void) {
  GC_INIT();

  records = (struct Record*) GC_MALLOC(sizeof(struct Record) * 7);
  struct Integer p0 = { sizeof(struct Any) };
  struct Array p1 = { 0, 1, GC_MALLOC(1) };
  struct Record r0 = { p0, p1 };
  records[0] = r0;
  records[0].properties.values[0] = &f1;

  return 0;
}





struct Any Any_to_any(struct Any this);
struct Any Integer_to_any(struct Integer this);
struct Any Float_to_any(struct Float this);
struct Any Boolean_to_any(struct Boolean this);
struct Any String_to_any(struct String this);

struct String Any_to_string(struct Any this);
struct String Integer_to_string(struct Integer this);
struct String Float_to_string(struct Float this);
struct String Boolean_to_string(struct Boolean this);
struct String String_to_string(struct String this);

int8_t Any_compare(struct Any a, struct Any b);
int8_t Integer_compare(struct Integer a, struct Integer b);
int8_t Float_compare(struct Float a, struct Float b);
int8_t Boolean_compare(struct Boolean a, struct Boolean b);
int8_t String_compare(struct String a, struct String b);

// Make
struct String String_make(char* str) {
  int n = strlen(str);
  char* buffer = GC_MALLOC(n);
  memcpy(buffer, str, n);
  struct String s = { n, buffer };
  return s;
};

// Convert
struct Any Any_to_any(struct Any this) {
  return this;
};
struct Any Integer_to_any(struct Integer this) {
  struct Integer* ptr = (struct Integer*)GC_MALLOC(sizeof(struct Integer));
  *ptr = this;
  struct Any a = { KIND_INTEGER, ptr };
  return a;
};
struct Any Float_to_any(struct Float this) {
  struct Float* ptr = (struct Float*)GC_MALLOC(sizeof(struct Float));
  *ptr = this;
  struct Any a = { KIND_FLOAT, ptr };
  return a;
};
struct Any Boolean_to_any(struct Boolean this) {
  struct Boolean* ptr = (struct Boolean*)GC_MALLOC(sizeof(struct Boolean));
  *ptr = this;
  struct Any a = { KIND_BOOLEAN, ptr };
  return a;
};
struct Any String_to_any(struct String this) {
  struct String* ptr = (struct String*)GC_MALLOC(sizeof(struct String));
  *ptr = this;
  struct Any a = { KIND_STRING, ptr };
  return a;
};

// To string
struct String Any_to_string(struct Any this) {
  switch(this.kind) {
  case KIND_INTEGER:
    return Integer_to_string(*(struct Integer*)this.ptr);
  case KIND_FLOAT:
    return Float_to_string(*(struct Float*)this.ptr);
  case KIND_BOOLEAN:
    return Boolean_to_string(*(struct Boolean*)this.ptr);
  case KIND_STRING:
    return *(struct String*)this.ptr;
  }
  struct String x = { 4, "null" };
  return x;
};
struct String Integer_to_string(struct Integer this) {
  char* buffer = GC_MALLOC(50);
  sprintf(buffer, "%d", this.value);
  int n = strlen(buffer);
  struct String s = { n, buffer };
  return s;
};
struct String Float_to_string(struct Float this) {
  char* buffer = GC_MALLOC(50);
  sprintf(buffer, "%f", this.value);
  int n = strlen(buffer);
  struct String s = { n, buffer };
  return s;
};
struct String Boolean_to_string(struct Boolean this) {
  if (this.value == 0) {
    return String_make("true");
  } else {
    return String_make("false");
  }
};
struct String String_to_string(struct String this) {
  return this;
};

// Compare
int8_t Any_compare(struct Any a, struct Any b) {
  if (a.kind == b.kind) {
    switch(a.kind) {
    case KIND_INTEGER:
      return Integer_compare(*(struct Integer*)a.ptr, *(struct Integer*)b.ptr);
    case KIND_FLOAT:
      return Float_compare(*(struct Float*)a.ptr, *(struct Float*)b.ptr);
    case KIND_BOOLEAN:
      return Boolean_compare(*(struct Boolean*)a.ptr, *(struct Boolean*)b.ptr);
    case KIND_STRING:
      return String_compare(*(struct String*)a.ptr, *(struct String*)b.ptr);
    }
  }
  return a.kind > b.kind ? 1 : -1;
};
int8_t Integer_compare(struct Integer a, struct Integer b) {
  return a.value > b.value ? 1 : a.value < b.value ? -1 : 0;
};
int8_t Float_compare(struct Float a, struct Float b) {
  return a.value > b.value ? 1 : a.value < b.value ? -1 : 0;
};
int8_t Boolean_compare(struct Boolean a, struct Boolean b) {
  return a.value > b.value ? 1 : a.value < b.value ? -1 : 0;
};
int8_t String_compare(struct String a, struct String b) {
  int n = a.size > b.size ? b.size : a.size;
  int v = memcmp(a.value, b.value, n);
  if (v == 0) {
    return a.size > b.size ? 1 : a.size < b.size ? -1 : 0;
  }
  return v;
};


void pp(struct Any this) {
  struct String str = Any_to_string(this);
  for (int i=0; i<str.size; i++) {
    printf("%c", ((char*) str.value)[i]);
  }
  printf("\n");
}


struct Node {
  struct Node* left;
  struct Node* right;
  struct Any key;
  struct Any value;
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
struct Any Tree_get(struct Tree* tree, struct Any key) {
  struct Node* node = tree->root;
  while (node != NULL) {
    int c = Any_compare(node->key, key);
    if (c == 1) {
      node = node->right;
    } else if (c == -1) {
      node = node->left;
    } else {
      return node->value;
    }
  }
  struct Any r = { 0, NULL };
  return r;
}
void Tree_set(struct Tree* tree, struct Any key, struct Any value) {
  if (tree->size == 0) {
    tree->root = (struct Node*)GC_MALLOC(sizeof(struct Node));
    tree->root->key = key;
    tree->root->value = value;
    tree->size++;
  } else {
    struct Node* node = tree->root;
    while (node != NULL) {
      int c = Any_compare(node->key, key);
      if (c == 1) {
        if (node->right != NULL) {
          node = node->right;
        } else {
          node->right = (struct Node*)GC_MALLOC(sizeof(struct Node));
          node = node->right;
          break;
        }
      } else if (c == -1) {
        if (node->left != NULL) {
          node = node->left;
        } else {
          node->left = (struct Node*)GC_MALLOC(sizeof(struct Node));
          node = node->left;
          break;
        }
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

  struct Float e0 = { 15.7558 };
  struct String e1 = { 4, "test" };
  struct String e2 = { 10, "test-later" };
  struct Boolean e3 = { 0 };

  struct Any v = Boolean_to_any(e3);
  struct Any k = String_to_any(e1);
  struct Any k2 = String_to_any(e2);

  struct Tree* t = Tree_new();
  Tree_set(t, k, v);
  Tree_set(t, k2, v);

  printf("Size: %d, test: ", t->size);
  pp(Tree_get(t, k));
  printf("\n");

  return 0;
}
 */