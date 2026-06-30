package availability

import "testing"

func TestOverlap(t *testing.T) {
	cases := []struct {
		name                   string
		aS, aE, bS, bE string
		want           bool
	}{
		{"PRD overlap 19-20 vs 19:30-20:30", "19:00", "20:00", "19:30", "20:30", true},
		{"PRD adjacent 19-20 vs 20-21", "19:00", "20:00", "20:00", "21:00", false},
		{"contained", "18:00", "22:00", "19:00", "20:00", true},
		{"disjoint before", "08:00", "09:00", "10:00", "11:00", false},
		{"exact same", "19:00", "20:00", "19:00", "20:00", true},
	}
	for _, c := range cases {
		if got := Overlap(c.aS, c.aE, c.bS, c.bE); got != c.want {
			t.Errorf("%s: Overlap = %v, want %v", c.name, got, c.want)
		}
	}
}

func TestDurationAndRange(t *testing.T) {
	if d := DurationHours("08:00", "09:30"); d != 1.5 {
		t.Errorf("DurationHours = %v, want 1.5", d)
	}
	if ValidRange("20:00", "20:00") {
		t.Error("equal start/end should be invalid")
	}
	if !ValidRange("08:00", "10:00") {
		t.Error("08-10 should be valid")
	}
}
