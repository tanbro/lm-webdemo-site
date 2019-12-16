class SpeechBubble extends React.Component {

    render() {
        // let bubble_dir = "bs-popover-right";

        return (
            <div class="d-flex flex-row">
                <div class="p-1">
                    <img src="holder.js/64x64?text=Robot" class="rounded-circle p-1" />
                </div>
                <div class="p-1">
                    <div class="popover bs-popover-right position-relative shadow my-1 mx-0" style="z-index: 1011;">
                        <div class="arrow"></div>
                        <div class="popover-body">
                            你好,我是心理机构咨询师刘老师。希望以下回答能帮助到你。
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<SpeechBubble />, document.getElementById('speech_bubble'));
