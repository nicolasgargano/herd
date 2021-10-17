import { Route } from "wouter"
import { Home } from "./pages/Home"
import * as React from "react"

export const App = () => (
  <>
    <Route path="/">
      <Home />
    </Route>
  </>
)
