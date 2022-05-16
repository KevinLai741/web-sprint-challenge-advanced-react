import React from "react"
import { render, fireEvent, screen } from '@testing-library/react'
import AppFunctional from "./AppFunctional"
import '@testing-library/jest-dom/extend-expect'

test('sanity', () => {
  expect(true).toBe(true)
})

beforeEach(() => {
  render(<AppFunctional/>)
})

test('Renders the coordinates heading', () => {
  const coordinatesHeader = screen.queryByText("Coordinates (2, 2)")
  expect(coordinatesHeader).toBeVisible()
  expect(coordinatesHeader).toBeInTheDocument()
})

test('Renders you moved', () => {
  const movementHeader = screen.queryByText("You moved 0 times")
  expect(movementHeader).toBeVisible()
  expect(movementHeader).toBeInTheDocument()
})

test('Renders left button', () => {
  const leftButton = screen.queryByText("LEFT")
  expect(leftButton).toBeVisible()
  expect(leftButton).toBeInTheDocument()
})

test('Renders right button', () => {
  const rightButton = screen.queryByText("RIGHT")
  expect(rightButton).toBeVisible()
  expect(rightButton).toBeInTheDocument()
})

test('Renders up button', () => {
  const upButton = screen.queryByText("UP")
  expect(upButton).toBeVisible()
  expect(upButton).toBeInTheDocument()
})

test('Renders down button', () => {
  const downButton = screen.queryByText("DOWN")
  expect(downButton).toBeVisible()
  expect(downButton).toBeInTheDocument()
})

test('Renders reset button', () => {
  const resetButton = screen.queryByText("reset")
  expect(resetButton).toBeVisible()
  expect(resetButton).toBeInTheDocument()
})

test('Email input field exists', () => {
  const emailInput = screen.getByPlaceholderText('type email')
  expect(emailInput).toBeVisible()
  expect(emailInput).toBeInTheDocument()
})

test('When you type in email address the value updates', () => {
  const emailInput = screen.getByPlaceholderText('type email')
  fireEvent.change(emailInput, {target: {value: 'kevinlai@gmail.com'}})
  expect(emailInput.value).toBe('kevinlai@gmail.com')
})