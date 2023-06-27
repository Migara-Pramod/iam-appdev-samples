package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
)

var (
	bloodRequirements = make(map[string]int)
	mutex             sync.Mutex
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/requirements", getRequirementsHandler).Methods("GET")
	r.HandleFunc("/requirements", addRequirementHandler).Methods("POST")

	log.Println("Server started on port 9098")
	http.ListenAndServe(":9098", r)
}

func getRequirementsHandler(w http.ResponseWriter, r *http.Request) {
	// Retrieve blood requirements
	mutex.Lock()
	defer mutex.Unlock()

	json.NewEncoder(w).Encode(bloodRequirements)
}

func addRequirementHandler(w http.ResponseWriter, r *http.Request) {
	// Parse the request body
	var requirement struct {
		BloodType string `json:"bloodType"`
		Amount    int    `json:"amount"`
	}

	err := json.NewDecoder(r.Body).Decode(&requirement)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Add new blood requirement
	mutex.Lock()
	defer mutex.Unlock()

	bloodRequirements[requirement.BloodType] += requirement.Amount

	w.WriteHeader(http.StatusCreated)
}
