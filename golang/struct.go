package golang

type Set struct {
	set   map[interface{}]struct{}
	empty struct{}
}

func (s *Set) construct() {
	if s.set == nil {
		s.set = map[interface{}]struct{}{}
		s.empty = struct{}{}
	}
}
func (s *Set) Put(value interface{}) {
	s.construct();
	s.set[value] = s.empty;
}
func (s *Set) List() []interface{} {
	s.construct();
	keys := make([]interface{}, 0, len(s.set))
	for k := range s.set {
		keys = append(keys, k)
	}
	return keys
}
func (s *Set) Has(value interface{}) bool {
	s.construct();
	for k := range s.set {
		if k == value {
			return true
		}
	}
	return false
}
