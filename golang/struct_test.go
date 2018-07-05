package golang

import (
	"testing"
	"github.com/hyperledger/fabric/common/ledger/testutil"
)

func TestSet_Has(t *testing.T) {
	var v1 = "abc"
	var set1 = Set{};
	set1.Put(v1)

	testutil.AssertEquals(t, set1.Has(v1), true)
}
