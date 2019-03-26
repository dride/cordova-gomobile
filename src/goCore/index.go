package goCore

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

// LoadClips will load clips form Dashcam
func LoadUser(userId string) (string, error) {
	if len(userId) == 0 {
		return "", fmt.Errorf("NO_USER_ID")
	}
	timeout := time.Duration(10 * time.Second)
	client := http.Client{
		Timeout: timeout,
	}
	resp, err := client.Get("https://yourServer.com/user?uid" + userId)
	body, err := ioutil.ReadAll(resp.Body)

	return string(body), err

}
