package main

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	// CORS Setup: Crucial for React to talk to Go
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{http.MethodGet, http.MethodPost},
	}))

	// Expanded "Filing Cabinet" with more models
	models := map[string]string{
		"gpt-4o":          "https://platform.openai.com/docs/models/gpt-4o",
		"gpt-3.5-turbo":   "https://platform.openai.com/docs/models/gpt-3-5-turbo",
		"llama-3-70b":     "https://llama.meta.com/llama3/",
		"llama-3-8b":      "https://llama.meta.com/llama3/",
		"claude-3-opus":   "https://www.anthropic.com/claude",
		"claude-3-sonnet": "https://www.anthropic.com/claude",
		"gemini-1.5-pro":  "https://ai.google.dev/models/gemini",
		"gemini-flash":    "https://ai.google.dev/models/gemini",
		"mistral-7b":      "https://mistral.ai/news/announcing-mistral-7b/",
	}

	e.GET("/search", func(c echo.Context) error {
		query := strings.ToLower(c.QueryParam("model"))

		if query == "" {
			return c.JSON(http.StatusOK, nil)
		}

		// FUZZY SEARCH LOGIC:
		// We loop through our map and check if the query is INSIDE the name.
		// If you type "gpt", it will find "gpt-4o"
		for name, link := range models {
			if strings.Contains(name, query) {
				return c.JSON(http.StatusOK, map[string]string{
					"model": name,
					"link":  link,
				})
			}
		}

		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "No model found. Try 'gpt' or 'llama'.",
		})
	})

	e.Logger.Fatal(e.Start(":1323"))
}
