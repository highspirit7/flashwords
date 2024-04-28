function isString(variable: any): variable is string {
  return typeof variable === 'string'
}

function isHTMLInputElement(
  targetElement: EventTarget | null | HTMLInputElement,
): targetElement is HTMLInputElement {
  return (targetElement as HTMLInputElement).value !== undefined
}

export { isString, isHTMLInputElement }

// TODO : 예문 업데이트 햇을 때 cardSets도 다 업데이트 잘되는지 확인 필요
