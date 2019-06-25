import React, { useState } from 'react';

function CollapsibleWell(props) {

    const [visible, setVisible] = useState(true);

    return (
        <div className="well pointable" onClick={()=>setVisible(!visible)}>
            <h4>
                <div>
                    { props.title }
                    { props.showFire &&
                        <i  className="glyphicon glyphicon-fire" style={{color:'red'}}></i>
                    }
                </div>
            </h4>
            { visible && props.children }
        </div>
    );
}

export default CollapsibleWell;