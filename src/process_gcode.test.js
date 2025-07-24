import { expect, test } from 'vitest'
import processGcode from './process_gcode.js'

function remove_last_two_comments(gcode) {
  const lines = gcode.trim().split('\n')
  return lines.slice(0, -2).join('\n')
}

function check_gcode(gcode, expected) {
  expect(remove_last_two_comments(gcode).trim()).toEqual(expected.trim())
}

test('processGcode handles G90 correctly', () => {
  const { newGcodeContent, netExtrude } = processGcode(`G90
; z syringe diameter 1
; a syringe diameter 1
; z nozzle diameter 1
; a nozzle diameter 1
; extrusion coefficient 1.0
G1 X10 F300
G1 X20`)
  check_gcode(newGcodeContent, `G90
G1 X10 E10.000 F300
G1 X20 E20.000`)
  expect(netExtrude).toBe(20)
})

test('processGcode handles G91 correctly', () => {
  const { newGcodeContent, netExtrude } = processGcode(`G91
; z syringe diameter 1
; a syringe diameter 1
; z nozzle diameter 1
; a nozzle diameter 1
; extrusion coefficient 1.0
G1 X10 F300
G1 X10`)
  check_gcode(newGcodeContent, `G91
G1 X10 E10.000 F300
G1 X10 E10.000`)
  expect(netExtrude).toBe(20)
})

test('G90 with B', () => {
  const { newGcodeContent, netExtrude } = processGcode(`G90
; z syringe diameter 1
; a syringe diameter 1
; z nozzle diameter 1
; a nozzle diameter 1
; extrusion coefficient 1.0
B
G1 X10 F300
G1 X20`)
  check_gcode(newGcodeContent, `G90
G1 X10 B10.000 F300
G1 X20 B20.000`)
  expect(netExtrude).toBe(20)
})

test('G90 with C', () => {
  const { newGcodeContent, netExtrude } = processGcode(`G90
; z syringe diameter 1
; a syringe diameter 1
; z nozzle diameter 1
; a nozzle diameter 1
; extrusion coefficient 1.0
C
G1 X10 F300
G1 X20`)
  check_gcode(newGcodeContent, `G90
G1 X10 C10.000 F300
G1 X20 C20.000`)
  expect(netExtrude).toBe(20)
})

test('G91 with B', () => {
  const { newGcodeContent, netExtrude } = processGcode(`G91
; z syringe diameter 1
; a syringe diameter 1
; z nozzle diameter 1
; a nozzle diameter 1
; extrusion coefficient 1.0
B
G1 X10 F300
G1 X10`)
  check_gcode(newGcodeContent, `G91
G1 X10 B10.000 F300
G1 X10 B10.000`)
  expect(netExtrude).toBe(20)
})

test('G91 with C', () => {
  const { newGcodeContent, netExtrude } = processGcode(`G91
; z syringe diameter 1
; a syringe diameter 1
; z nozzle diameter 1
; a nozzle diameter 1
; extrusion coefficient 1.0
C
G1 X10 F300
G1 X10`)
  check_gcode(newGcodeContent, `G91
G1 X10 C10.000 F300
G1 X10 C10.000`)
  expect(netExtrude).toBe(20)
})

test('Test extrusion coeff K=2', () => {
  const { newGcodeContent, netExtrude } = processGcode(`G91
; z syringe diameter 1
; a syringe diameter 1
; z nozzle diameter 1
; a nozzle diameter 1
; extrusion coefficient 2.0
B
G1 X3 Y4 F300
G1 X3 Z4`)
  check_gcode(newGcodeContent, `G91
G1 X3 Y4 B10.000 F300
G1 X3 Z4 B10.000`)
  expect(netExtrude).toBe(20)
})

test('Test extrusion coeff K=2,1', () => {
  const { newGcodeContent, netExtrude } = processGcode(`G91
; z syringe diameter 1
; a syringe diameter 1
; z nozzle diameter 1
; a nozzle diameter 1
; extrusion coefficient 2.0
B
G1 X3 Y4 F300
G1 X3 Z4
K = 1
G1 X3 Y4
G1 X3 Z4`)
  check_gcode(newGcodeContent, `G91
G1 X3 Y4 B10.000 F300
G1 X3 Z4 B10.000
; extrusion coefficient changed to = 1
G1 X3 Y4 B5.000
G1 X3 Z4 B5.000`)
  expect(netExtrude).toBe(30)
})

test('Test nozzle diameter = 0.707', () => {
  const { newGcodeContent, netExtrude } = processGcode(`G91
; z syringe diameter 1
; a syringe diameter 1
; z nozzle diameter 0.707
; a nozzle diameter 0.707
; extrusion coefficient 1.0
B
G1 X3 Y4 F300
G1 X3 Z4`)
  check_gcode(newGcodeContent, `G91
G1 X3 Y4 B2.499 F300
G1 X3 Z4 B2.499`)
  expect(netExtrude).toBeCloseTo(4.998)
})

test('Test nozzle diameter = 0.707, K=2', () => {
  const { newGcodeContent, netExtrude } = processGcode(`G91
; z syringe diameter 1
; a syringe diameter 1
; z nozzle diameter 0.707106
; a nozzle diameter 0.707106
; extrusion coefficient 2.0
B
G1 X3 Y4 F300
G1 X3 Z4`)
  check_gcode(newGcodeContent, `G91
G1 X3 Y4 B5.000 F300
G1 X3 Z4 B5.000`)
  expect(netExtrude).toBeCloseTo(10)
})