#include<stdlib.h>
#include<stdio.h>

struct SValue {
	uint type;
	void* value;
};
typedef struct SValue Value;

struct Node {
   struct Node * right, * left;
   int val;
};

int main() {
	Value v;
	v.type = 32;
	v.value = &v;
	printf("%d\n", v.type);
	return 0;
}