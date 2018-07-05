package golang

import (
	"testing"
	"github.com/hyperledger/fabric/common/ledger/testutil"
)

func TestSet_Has(t *testing.T) {
	var v1 = "abc"
	var v2 = "bcd"
	var v3 = "not"
	var set1 = Set{};
	set1.Put(v1)
	set1.Put(v2);
	testutil.AssertEquals(t, set1.Has(v1), true)
	testutil.AssertEquals(t, set1.Has(v3), false)
	var list = set1.List();
	testutil.AssertEquals(t, len(list),2)
}
