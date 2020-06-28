var request = require('request')

describe('calc', ()=>{
    it('should multiply 2 and 2', ()=>{
        expect(2*2).toBe(4)
    })
})

describe('get tasks', () =>{
    it('should return 200 ok', (done)=>{
        request.get('http://localhost:3000/tasks', (err, res)=>{
            // console.log(res)
        expect(res.statusCode).toEqual(200)
            done()
        })
    })

    it('should return a list thats not empty', (done)=>{
        request.get('http://localhost:3000/tasks', (err, res)=>{
            expect(JSON.parse(res.body).length).toBeGreaterThan(0)
            done()
        })
    })
})

describe('get tasks by category', () => {
    it('should return 200 ok', (done)=>{
        request.get('http://localhost:3000/tasks/general', (err, res)=>{
            expect(res.statusCode).toEqual(200)
            done()
        })
    })
    it('category should be general', (done)=>{
        request.get('http://localhost:3000/tasks', (err, res)=>{
            // expect(JSON.parse(res.body)[0].name).toEqual('general')
            console.log('res ' + res)
            done()
        })
    })
})