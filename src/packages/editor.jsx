import { computed, defineComponent, inject, ref } from "vue";
import './editor.scss'
import EditorBlock from './editor-block'
import deepcopy from "deepcopy";
import { useMenuDragger } from "./useMenuDragger";
import { useFocus } from "./useFocus";
import { useBlockDragger } from "./useBlockDragger";

export default defineComponent({
    props: {
        modelValue: { type: Object }
    },
    emits: ['update:modelValue'], // 要触发的事件
    setup(props, ctx) {
        // 用于获取和设置 props.modelValue，并在设置时触发更新事件
        const data = computed({
            get() {
                return props.modelValue
            },
            set(newValue) {
                console.log('update:modelValue')
                // 赋值后触发emit更新
                ctx.emit('update:modelValue', deepcopy(newValue))
            }
        });

        // 使用 computed 创建了一个名为 containerStyles 的计算属性，用于动态计算容器样式
        const containerStyles = computed(() => ({
            width: data.value.container.width + 'px',
            height: data.value.container.height + 'px'
        }))

        // 使用 inject 获取了名为 config 的注入对象
        const config = inject('config');

        // 创建了一个名为 containerRef 的响应式引用，用于引用编辑器容器
        const containerRef = ref(null);

        // 1.实现菜单的拖拽功能    处理菜单拖拽相关逻辑的hook
        const { dragstart, dragend } = useMenuDragger(containerRef, data);

        // 2.实现获取焦点 选中后可能直接就进行拖拽了  处理获取焦点相关逻辑的hook
        let { blockMousedown, focusData, containerMousedown } = useFocus(data, (e) => {
            // 获取焦点后进行拖拽
            mousedown(e)
        });
        
        // 2.实现组件拖拽  组件拖拽的hook
        let { mousedown } = useBlockDragger(focusData);

        // 3.实现拖拽多个元素的功能

        // 返回渲染函数
        return () => <div class="editor">
            <div class="editor-left">
                {/* 根据注册列表 渲染对应的内容  可以实现h5的拖拽*/}
                {config.componentList.map(component => (
                    <div
                        class="editor-left-item"
                        draggable
                        onDragstart={e => dragstart(e, component)}
                        onDragend={dragend}
                    >
                        <span>{component.label}</span>
                        <div>{component.preview()}</div>
                    </div>
                ))}
            </div>
            <div class="editor-top">菜单栏</div>
            <div class="editor-right">属性控制栏目</div>
            <div class="editor-container">
                {/*  负责产生滚动条 */}
                <div class="editor-container-canvas">
                    {/* 产生内容区域 */}
                    <div
                        class="editor-container-canvas__content"
                        style={containerStyles.value}
                        ref={containerRef}
                        onMousedown={containerMousedown}
                    >
                        {Math.random()}
                        {
                              // blockMousedown  reactive会进行深度监听 所以当block发生变化的时候 页面会刷新
                            (data.value.blocks.map(block => (
                                // onMousedown 在渲染容器内拖动元素
                                <EditorBlock
                                    class={block.focus ? 'editor-block-focus' : ''}
                                    block={block}
                                    onMousedown={(e) => blockMousedown(e, block)}
                                    key={block._id}
                                ></EditorBlock>
                            )))
                        }
                    </div>
                </div>

            </div>
        </div>
    }
})