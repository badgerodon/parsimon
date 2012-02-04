; ModuleID = 'node.c'
target datalayout = "e-p:64:64:64-i1:8:8-i8:8:8-i16:16:16-i32:32:32-i64:64:64-f32:32:32-f64:64:64-v64:64:64-v128:128:128-a0:0:64-s0:64:64-f80:128:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

%struct.tree_el = type { i32, %struct.tree_el*, %struct.tree_el* }

@.str = private unnamed_addr constant [4 x i8] c"%d\0A\00", align 1

define void @insert(%struct.tree_el** %tree, %struct.tree_el* %item) nounwind uwtable {
  %1 = alloca %struct.tree_el**, align 8
  %2 = alloca %struct.tree_el*, align 8
  store %struct.tree_el** %tree, %struct.tree_el*** %1, align 8
  store %struct.tree_el* %item, %struct.tree_el** %2, align 8
  %3 = load %struct.tree_el*** %1, align 8
  %4 = load %struct.tree_el** %3
  %5 = icmp ne %struct.tree_el* %4, null
  br i1 %5, label %9, label %6

; <label>:6                                       ; preds = %0
  %7 = load %struct.tree_el** %2, align 8
  %8 = load %struct.tree_el*** %1, align 8
  store %struct.tree_el* %7, %struct.tree_el** %8
  br label %38

; <label>:9                                       ; preds = %0
  %10 = load %struct.tree_el** %2, align 8
  %11 = getelementptr inbounds %struct.tree_el* %10, i32 0, i32 0
  %12 = load i32* %11, align 4
  %13 = load %struct.tree_el*** %1, align 8
  %14 = load %struct.tree_el** %13
  %15 = getelementptr inbounds %struct.tree_el* %14, i32 0, i32 0
  %16 = load i32* %15, align 4
  %17 = icmp slt i32 %12, %16
  br i1 %17, label %18, label %23

; <label>:18                                      ; preds = %9
  %19 = load %struct.tree_el*** %1, align 8
  %20 = load %struct.tree_el** %19
  %21 = getelementptr inbounds %struct.tree_el* %20, i32 0, i32 2
  %22 = load %struct.tree_el** %2, align 8
  call void @insert(%struct.tree_el** %21, %struct.tree_el* %22)
  br label %38

; <label>:23                                      ; preds = %9
  %24 = load %struct.tree_el** %2, align 8
  %25 = getelementptr inbounds %struct.tree_el* %24, i32 0, i32 0
  %26 = load i32* %25, align 4
  %27 = load %struct.tree_el*** %1, align 8
  %28 = load %struct.tree_el** %27
  %29 = getelementptr inbounds %struct.tree_el* %28, i32 0, i32 0
  %30 = load i32* %29, align 4
  %31 = icmp sgt i32 %26, %30
  br i1 %31, label %32, label %37

; <label>:32                                      ; preds = %23
  %33 = load %struct.tree_el*** %1, align 8
  %34 = load %struct.tree_el** %33
  %35 = getelementptr inbounds %struct.tree_el* %34, i32 0, i32 1
  %36 = load %struct.tree_el** %2, align 8
  call void @insert(%struct.tree_el** %35, %struct.tree_el* %36)
  br label %37

; <label>:37                                      ; preds = %32, %23
  br label %38

; <label>:38                                      ; preds = %6, %37, %18
  ret void
}

define void @printout(%struct.tree_el* %tree) nounwind uwtable {
  %1 = alloca %struct.tree_el*, align 8
  store %struct.tree_el* %tree, %struct.tree_el** %1, align 8
  %2 = load %struct.tree_el** %1, align 8
  %3 = getelementptr inbounds %struct.tree_el* %2, i32 0, i32 2
  %4 = load %struct.tree_el** %3, align 8
  %5 = icmp ne %struct.tree_el* %4, null
  br i1 %5, label %6, label %10

; <label>:6                                       ; preds = %0
  %7 = load %struct.tree_el** %1, align 8
  %8 = getelementptr inbounds %struct.tree_el* %7, i32 0, i32 2
  %9 = load %struct.tree_el** %8, align 8
  call void @printout(%struct.tree_el* %9)
  br label %10

; <label>:10                                      ; preds = %6, %0
  %11 = load %struct.tree_el** %1, align 8
  %12 = getelementptr inbounds %struct.tree_el* %11, i32 0, i32 0
  %13 = load i32* %12, align 4
  %14 = call i32 (i8*, ...)* @printf(i8* getelementptr inbounds ([4 x i8]* @.str, i32 0, i32 0), i32 %13)
  %15 = load %struct.tree_el** %1, align 8
  %16 = getelementptr inbounds %struct.tree_el* %15, i32 0, i32 1
  %17 = load %struct.tree_el** %16, align 8
  %18 = icmp ne %struct.tree_el* %17, null
  br i1 %18, label %19, label %23

; <label>:19                                      ; preds = %10
  %20 = load %struct.tree_el** %1, align 8
  %21 = getelementptr inbounds %struct.tree_el* %20, i32 0, i32 1
  %22 = load %struct.tree_el** %21, align 8
  call void @printout(%struct.tree_el* %22)
  br label %23

; <label>:23                                      ; preds = %19, %10
  ret void
}

declare i32 @printf(i8*, ...)

define i32 @main() nounwind uwtable {
  %1 = alloca i32, align 4
  %curr = alloca %struct.tree_el*, align 8
  %root = alloca %struct.tree_el*, align 8
  %i = alloca i32, align 4
  store i32 0, i32* %1
  store %struct.tree_el* null, %struct.tree_el** %root, align 8
  store i32 1, i32* %i, align 4
  br label %2

; <label>:2                                       ; preds = %16, %0
  %3 = load i32* %i, align 4
  %4 = icmp sle i32 %3, 10
  br i1 %4, label %5, label %19

; <label>:5                                       ; preds = %2
  %6 = call noalias i8* @malloc(i64 24) nounwind
  %7 = bitcast i8* %6 to %struct.tree_el*
  store %struct.tree_el* %7, %struct.tree_el** %curr, align 8
  %8 = load %struct.tree_el** %curr, align 8
  %9 = getelementptr inbounds %struct.tree_el* %8, i32 0, i32 1
  store %struct.tree_el* null, %struct.tree_el** %9, align 8
  %10 = load %struct.tree_el** %curr, align 8
  %11 = getelementptr inbounds %struct.tree_el* %10, i32 0, i32 2
  store %struct.tree_el* null, %struct.tree_el** %11, align 8
  %12 = call i32 @rand() nounwind
  %13 = load %struct.tree_el** %curr, align 8
  %14 = getelementptr inbounds %struct.tree_el* %13, i32 0, i32 0
  store i32 %12, i32* %14, align 4
  %15 = load %struct.tree_el** %curr, align 8
  call void @insert(%struct.tree_el** %root, %struct.tree_el* %15)
  br label %16

; <label>:16                                      ; preds = %5
  %17 = load i32* %i, align 4
  %18 = add nsw i32 %17, 1
  store i32 %18, i32* %i, align 4
  br label %2

; <label>:19                                      ; preds = %2
  %20 = load %struct.tree_el** %root, align 8
  call void @printout(%struct.tree_el* %20)
  ret i32 0
}

declare noalias i8* @malloc(i64) nounwind

declare i32 @rand() nounwind
