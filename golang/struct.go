package golang

type Set struct {
	set   map[interface{}]struct{}
	empty struct{}
}

func (s *Set) Put(value interface{}) {
	s.set[value] = s.empty;
}
func (s *Set) List() []interface{} {
	keys := make([]interface{}, 0, len(s.set))
	for k := range s.set {
		keys = append(keys, k)
	}
	return keys
}
func (s *Set) Has(value interface{}) bool {
	for k := range s.set {
		if k == value {
			return true
		}
	}
	return false
}
