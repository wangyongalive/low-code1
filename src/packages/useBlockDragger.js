export function useBlockDragger(focusData) {
  let dragState = {
    startX: 0,
    startY: 0,
  };

  // 当鼠标按下时触发的事件处理函数
  const mousedown = (e) => {
    // 用于存储拖拽状态的相关信息，包括拖拽起始点的坐标和选中块元素的初始位置
    dragState = {
      startX: e.clientX,
      startY: e.clientY, // 记录每一个选中的位置
      startPos: focusData.value.focus.map(({ top, left }) => ({ top, left })), // 记录选中元素的开始位置
    };
    // 添加了 mousemove 和 mouseup 事件监听器，以便在拖拽过程中持续跟踪鼠标移动和释放事件。
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  };
  // 当鼠标移动时触发的事件处理函数
  const mousemove = (e) => {
    // 计算鼠标移动的距离，并根据这个距离更新当前被选中的块元素的位置，实现拖拽效果。
    let { clientX: moveX, clientY: moveY } = e;
    let durX = moveX - dragState.startX;
    let durY = moveY - dragState.startY;
    focusData.value.focus.forEach((block, idx) => {
      block.top = dragState.startPos[idx].top + durY;
      block.left = dragState.startPos[idx].left + durX;
    });
  };

  const mouseup = (e) => {
    // 当鼠标释放时触发的事件处理函数。
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
  };

  // 返回了一个对象，其中包含了 mousedown 方法，用于在组件中调用以启动拖拽操作。

  return {
    mousedown,
  };
}
