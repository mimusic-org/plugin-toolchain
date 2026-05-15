package main

import (
	"fmt"
	"os"

	"modernc.org/quickjs"
)

func main() {
	if len(os.Args) != 3 {
		fmt.Fprintf(os.Stderr, "Usage: jsc <input.js> <output.jsc>\n")
		os.Exit(1)
	}
	inputFile := os.Args[1]
	outputFile := os.Args[2]

	// 读取源码
	source, err := os.ReadFile(inputFile)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading input: %v\n", err)
		os.Exit(1)
	}

	// 创建 QuickJS VM 并编译为字节码
	vm, err := quickjs.NewVM()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating VM: %v\n", err)
		os.Exit(1)
	}
	defer vm.Close()

	bytecode, err := vm.Compile(string(source), quickjs.EvalGlobal)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Compile error: %v\n", err)
		os.Exit(1)
	}

	// 写入输出文件
	if err := os.WriteFile(outputFile, bytecode, 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing output: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Compiled %s → %s (%d bytes)\n", inputFile, outputFile, len(bytecode))
}
