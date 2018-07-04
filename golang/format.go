package golang

import (
	"strconv"
	"encoding/json"
)

func ToInt(bytes []byte) int {
	if bytes == nil {
		return 0
	}
	i, err := strconv.Atoi(string(bytes))
	if err != nil {
		panic(err)
	}
	return i
}
func ToBytes(i int) []byte {
	return []byte(strconv.Itoa(i))
}
func panicError(err error) {
	if err != nil {
		panic(err)
	}
}

func fromJson(jsonString []byte, v interface{}) {
	err := json.Unmarshal(jsonString, &v)
	panicError(err);
}

func toJson(v interface{}) []byte {
	result, err := json.Marshal(v)
	panicError(err)
	return result
}
