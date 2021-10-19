import { Route } from "wouter"
import { Home } from "./pages/Home"
import * as React from "react"
import { Sandbox } from "./pages/Sandbox"

export const App = () => (
  <>
    <Route path="/">
      <Home />
    </Route>
    <Route path="/sandbox">
      <Sandbox />
    </Route>
  </>
)
