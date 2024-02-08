
// 这段代码定义了一个名为 EditorBlock 的 Vue 组件，用于渲染编辑器中的块元素。
import { computed, defineComponent, inject, onMounted, ref } from "vue";


// 使用 defineComponent 定义了一个 Vue 组件，名为 EditorBlock。
export default defineComponent({
    props: {
        block: { type: Object }
    },
    setup(props) {
        // 定义了一个计算属性 blockStyles，用于动态计算块元素的样式，包括 top, left, 和 zIndex。
        const blockStyles = computed(() => ({
            top: `${props.block.top}px`,
            left: `${props.block.left}px`,
            zIndex: `${props.block.zIndex}`
        }));

        // 使用 inject 获取了名为 config 的注入对象，用于获取组件配置信息。
        const config = inject('config');
        // 创建了一个名为 blockRef 的 ref 对象，用于引用块元素的 DOM 元素。
        const blockRef = ref(null)
        // 使用 onMounted 钩子函数，当组件挂载到 DOM 上后执行对应的逻辑
        onMounted(() => {
            // 在挂载后，获取块元素的宽度和高度，并根据 alignCenter 属性对块元素的位置进行调整，使其水平垂直居中显示。
            let { offsetWidth, offsetHeight } = blockRef.value;
            // alignCenter 属性用于指示块元素是否需要居中显示，
            // 通过调整坐标实现水平垂直居中效果，
            // 并在调整完成后将其设置为 false，以确保只在需要时才居中显示。
            if (props.block.alignCenter) { // 说明是拖拽松手的时候才渲染的，其他的默认渲染到页面上的内容不需要居中
                props.block.left = props.block.left - offsetWidth / 2;
                props.block.top = props.block.top - offsetHeight / 2; // 原则上重新派发事件
                props.block.alignCenter = false; // 让渲染后的结果才能去居中
            }
        })

        return () => {
            // 通过block的key属性直接获取对应的组件 
            const component = config.componentMap[props.block.key];
            // 获取render函数
            const RenderComponent = component.render();
            return <div class="editor-block" style={blockStyles.value} ref={blockRef}>
                {RenderComponent}
            </div>
        }
    }
})