import React from 'react'


export default function InternerComp({ userNick, userId, gohome, setId}) {

        //className="button bar" gefolgt von Buttons
        return (<>
            <div className="internContainer">
                <h1>Interner bereich</h1>
                <button onClick={gohome}></button>
            </div>
        </>)
}
