import React from 'react';
import { Group, Text, Circle, RegularPolygon } from 'react-konva';

const CircleState = ({
  shape,
  tool,
  onShapeClick,
  onShapeDarg,
  isSelected,
  isInitial,
  doubleClickOnState,
}) => {
  const renderFinal = () => {
    if (shape.isFinal)
      return (
        <Circle
          radius={26}
          stroke="black"
          fill={isSelected ? '#ffc93c' : 'white'}
        />
      );

    return null;
  };
  const renderInitial = () => {
    if (isInitial)
      return (
        <RegularPolygon
          sides={3}
          radius={25}
          stroke="black"
          strokeWidth={1.5}
          rotation={-30}
          x={-55}
          fill={isSelected ? '#ffc93c' : 'white'}
        />
      );

    return null;
  };

  const changeCurosr = (cursor) => {
    if (tool === 'select') document.body.style.cursor = cursor;
    // if (tool === 'delete')
    //   document.body.style.cursor =
    //     'url(https://terminol.goodfollower.com/close-outline.png), auto';
    // console.log(document.body.style.cursor);
  };

  return (
    <Group
      key={'q' + shape.id + (isInitial ? '-initial' : '')}
      {...shape}
      draggable={tool === 'select'}
      onDblClick={(e) => doubleClickOnState(e)}
      onClick={(e) => onShapeClick(e)}
      onDragMove={(e) => onShapeDarg(e)}
      onDragStart={() => changeCurosr('grabbing')}
      onDragEnd={() => changeCurosr('grab')}
      onMouseOver={() => changeCurosr('grab')}
      onMouseLeave={() => changeCurosr('default')}
      id={shape.id}
    >
      <Circle
        radius={30}
        stroke="black"
        fill={isSelected ? '#ffc93c' : 'white'}
      />
      {renderFinal()}
      {renderInitial()}
      <Text
        x={shape.name.length >= 3 ? -15 : -6}
        y={shape.name.length >= 3 ? -6 : -6}
        text={shape.name}
        fontSize={13}
      />
    </Group>
  );
};

export default CircleState;
