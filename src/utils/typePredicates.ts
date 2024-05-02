function isString(variable: any): variable is string {
  return typeof variable === 'string'
}

function isHTMLInputElement(
  targetElement: EventTarget | null | HTMLInputElement,
): targetElement is HTMLInputElement {
  return (targetElement as HTMLInputElement).value !== undefined
}

export { isString, isHTMLInputElement }
