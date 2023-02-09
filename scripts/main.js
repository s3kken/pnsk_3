let eventBus = new Vue()

Vue.component('columns',{

template: `
<div class="list-notes">
<div class="row-col">
<create-card></create-card>
    <div class="col">
        <card-form v-for="card in cardsOne" :card="card"></card-form>
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
    eventBus.$on('card-submitted', card => {
        this.cardsOne.push(card)
    })
},

})

Vue.component('card-edit',{
    template:`
    <div class="cardOne">
        <form class="text-form-card">
            <label for="title">Заголовок</label>
            <input v-model="title" id="title" type="text" placeholder="title">
            <textarea v-model="task" placeholder="task description"></textarea>
            <input v-model="deadline" type="date">
            <button type="submit">Yes</button>
            <button type="submit">No</button>
        </form>
    </div>
    `,
})

Vue.component('card-form',{
    template: `
    <div class="cardOne">
    <p>{{ card.title }}</p>
    <p>{{ card.task }}</p>
    <p>Deadline:{{ card.deadline }}</p>
    <p>Дата создания:{{card.dateCreate}}</p>

    </div>
    `,
    props: {
        card: Object
    }
})

Vue.component('create-card',{
    template:`
    <div class="forms-create-card">
        <form class="text-form-card" @submit.prevent="onSubmit">
            <label for="title">Заголовок</label>
            <input v-model="title" id="title" type="text" placeholder="title">
            <textarea v-model="task" placeholder="task description"></textarea>
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
                let card = {
                    title: this.title,
                    task: this.task,
                    deadline: this.deadline,
                    dateCreate: new Date().toLocaleString()
                }
                eventBus.$emit('card-submitted', card)

                this.title = null
                this.task = null
                this.deadline = null
            } else {
                if (!this.title) this.errors.push("Заполните заголовок!")
                if (!this.task) this.errors.push("Заполните описание задачи!")
                if (!this.deadline) this.errors.push("Выберите дедлайн!")
            }
        }
    }
})

let app = new Vue({
    el: '#app',
    data(){
        return{
            check: false
        }
    }

})