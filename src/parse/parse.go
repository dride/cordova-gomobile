package main

import (
	"encoding/json"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"io/ioutil"
	"log"
	"os"
)

func main() {
	dir, err := os.Getwd()
	fmt.Println(dir)

	fset := token.NewFileSet()
	node, err := parser.ParseFile(fset, "../goCore/index.go", nil, parser.ParseComments)
	if err != nil {
		log.Fatal(err)
	}

	functions := []Function{}

	for _, f := range node.Decls {
		fn, ok := f.(*ast.FuncDecl)
		if !ok {
			continue
		}

		inputParams := []Param{}

		for i := 0; i < len(fn.Type.Params.List); i++ {
			paramType := fmt.Sprintf("%v", fn.Type.Params.List[i].Type)
			if paramType != "bool" && paramType != "int" && paramType != "string" {
				fmt.Println(fn.Name.Name, ":[Param]", fmt.Sprintf("%v", paramType), " is not a supported type (bool, int, string), skipping...")
			} else {
				t := Param{Name: fn.Type.Params.List[i].Names[0].Name, PType: paramType}
				inputParams = append(inputParams, t)
			}
		}

		ret := ""
		if fn.Type.Results != nil {
			ret = fmt.Sprintf("%v", fn.Type.Results.List[0].Type)
		}
		if ret != "" && ret != "bool" && ret != "int" && ret != "string" {
			fmt.Println(fn.Name.Name, ":[Return] ", ret, " is not a supported type (bool, int, string), skipping...")
			ret = ""
		}
		tf := Function{Name: fn.Name.Name, Return: ret, Params: inputParams}
		functions = append(functions, tf)

	}

	//comments
	for i := 0; i < len(node.Comments); i++ {
		functions[i].Comment = node.Comments[i].Text()
	}

	FunctionsJSON, err := json.Marshal(functions)
	ioutil.WriteFile("../../sourceMap.json", FunctionsJSON, 0644)
}

type Function struct {
	Name    string
	Params  []Param
	Return  string
	Comment string
}
type Param struct {
	Name  string
	PType string
}
