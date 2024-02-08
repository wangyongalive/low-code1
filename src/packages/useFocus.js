import { computed } from "vue";
export function useFocus(data, callback) {
  // 获取哪些元素被选中了  那些没有选中
  const focusData = computed(() => {
    let focus = [];
    let unfocused = [];
    console.log(data.value.blocks, " data.value.blocks");
    data.value.blocks.forEach((block) =>
      (block.focus ? focus : unfocused).push(block)
    );
    console.log("computed", focus, unfocused);
    return { focus, unfocused };
  });

  //    清空选中的block
  const clearBlockFocus = () => {
    console.log("clearBlockFocus");
    data.value.blocks.forEach((block) => (block.focus = false));
  };

  //   点击外面 取消所有焦点
  const containerMousedown = () => {
    console.log("containerMousedown!!!");
    clearBlockFocus(); // 点击容器让选中的失去焦点
    focusData.value; // 手动调用一下focusData 手动触发computed的getter函数 以此重新计算激活和非激活的元素
  };

  const blockMousedown = (e, block) => {
    e.preventDefault(); // 阻止默认行为
    e.stopPropagation(); // 阻止事件冒泡
    // block上我们规划一个属性 focus 获取焦点后就将focus变为true
    if (e.shiftKey) {
      block.focus = !block.focus;
    } else {
      if (!block.focus) {
        clearBlockFocus();
        block.focus = true; // 要清空其他人foucs属性
      } else {
        block.focus = false;
      }
    }
    // 点击完成后 调用外部的函数
    callback(e);
  };
  return {
    blockMousedown,
    containerMousedown,
    focusData,
  };
}
