import React from 'react';
import { Group, Text, Tag, Arrow, Label } from 'react-konva';
import _ from 'lodash';

const Transiton = ({
  from,
  to,
  deleteTransition,
  data,
  transitionIndex,
  transitions,
  doubleClickOnTransition,
}) => {
  if (!from || !to) return null;

  let arrowCurve, circlePoints;

  const dx = from.x - to.x;
  const dy = from.y - to.y;
  let angle = Math.atan2(-dy, dx);

  const radius = 30;

  const arrowEnd = {
    x: to.x + -radius * Math.cos(angle + Math.PI),
    y: to.y + radius * Math.sin(angle + Math.PI),
  };
  const arrowStart = {
    x: from.x + -radius * Math.cos(angle),
    y: from.y + radius * Math.sin(angle),
  };

  const endX = arrowEnd.x - arrowStart.x;
  const endY = arrowEnd.y - arrowStart.y;

  const opposite = _.findIndex(transitions, { idFrom: to.id, idTo: from.id });
  if (opposite !== -1) {
    const curvePower = 30;

    if (opposite > transitionIndex) {
      // this one should go down
      arrowCurve = {
        x: (from.x + to.x) / 2 + curvePower * Math.cos(angle + Math.PI / 2),
        y: (from.y + to.y) / 2 + curvePower * Math.sin(angle - Math.PI / 2),
      };
    } else {
      // this one should go up
      arrowCurve = {
        x: (from.x + to.x) / 2 + curvePower * Math.cos(angle + Math.PI / 2),
        y: (from.y + to.y) / 2 + curvePower * Math.sin(angle - Math.PI / 2),
      };
    }
    circlePoints = [
      0,
      0,
      arrowCurve.x - arrowStart.x,
      arrowCurve.y - arrowStart.y + (to === from ? -30 : 0),
      endX,
      endY,
    ];
  } else {
    circlePoints = [0, 0, endX, endY];
  }

  return (
    <Group
      onClick={deleteTransition}
      onDblClick={(e) => doubleClickOnTransition(e)}
      id={data.id}
      x={arrowStart.x}
      y={arrowStart.y}
    >
      <Arrow
        name="arrow"
        id={data.id}
        tension={0.3 + (to === from ? 0.2 : 0)}
        points={circlePoints}
        strokeWidth={3}
        stroke="black"
      />
      {data.values.map((value, index) => {
        return (
          <Label
            name="text"
            id={data.id}
            key={value}
            x={
              (circlePoints.length === 4
                ? (endX * 0.85) / 2
                : arrowCurve.x - arrowStart.x) +
              (to === from ? -8 : -20 + index * 25)
            }
            y={
              (circlePoints.length === 4
                ? endY / 2
                : arrowCurve.y - arrowStart.y) +
              (to === from ? -55 - 24 * index : 0)
            }
          >
            <Tag fill={index % 2 !== 0 ? '#ff5200' : 'black'} />
            <Text
              text={value}
              fill="white"
              padding={5}
              id={data.id}
              name="text"
            />
          </Label>
        );
      })}
    </Group>
  );
};

export default Transiton;
