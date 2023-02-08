let eventBus = new Vue()

Vue.component('KanbanList',{

template: `
<div class="list-notes">
<div class="row-col">
    <div class="col">
        
    </div>
    <div class="col">

    </div>
    <div class="col">

    </div>
    <div class="col">

    </div>
</div>
</div>
`,
data() {
    return {
        cardsOne: [],
        cardsTwo: [],
        cardsThree: [],
        cardsFour: []
    }
},
mounted() {
    eventBus.$on('card-submitted', createCard => {
        this.cardsOne.push(createCard)
    })
},

})

Vue.component('card',{
    template: `
    <div class="cardOne">
    <p>{{ createCard.title }}</p>
    <p>{{ createCard.task }}</p>
    <p>{{ createCard.deadline }}</p>
    </div>
    `
})

Vue.component('createCard',{
    template:`
    <div class="forms-create-card">
        <form class="text-form-card">
            <label for="title">Заголовок</label>
            <input v-model="title" id="title" type="text" placeholder="title">
            <textarea v-model="task"></textarea>
            <input v-model="deadline" type="date">
            <button type="submit">Создать</button>
            <p v-if="errors.length">
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>
        </form>
    </div>
    `,
    data(){
        return {
            title: null,
            task: null,
            deadline: null,
            dateCreate: null,
            errors: []
        }
    },
    methods:{
        onSubmit(){
            if(this.title && this.task && this.deadline){
                let createCard = {
                    title: this.title,
                    task: this.task,
                    deadline: this.deadline,
                    dateCreate: null
                }
                this.$emit('card-submitted', createCard)

                this.title = null
                this.task = null
                this.deadline = null
            } else {
                if (!this.title) this.errors.push("Заполните первый пункт!")
                if (!this.task) this.errors.push("Заполните второй пункт!")
                if (!this.deadline) this.errors.push("Заполните третий пункт!")
            }
        }
    }
})

let app = new Vue({
    el: '#app'

})