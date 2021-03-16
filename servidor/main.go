package main

import "github.com/gofiber/fiber"

func main() {
	app := fiber.New()

	app.Static("/", "../client/components/")

	app.Listen(":4000")
}
