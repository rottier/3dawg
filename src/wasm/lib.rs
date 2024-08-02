use wasm_bindgen::prelude::*;
use js_sys::Function;
use std::cell::{RefCell, Cell};
use std::rc::Rc;

thread_local! {
    static CALLBACK: RefCell<Option<Rc<Function>>> = RefCell::new(None);
    static COUNT: Cell<i32> = Cell::new(0);
}

#[wasm_bindgen(js_name = setCountUpdateCallback)]
pub fn set_count_update_callback(callback: &Function) {
    CALLBACK.with(|cb| {
        *cb.borrow_mut() = Some(callback.clone().into());
    });
}

#[wasm_bindgen]
pub fn increment(increment: i32) -> i32 {
    // Access and modify the count
    let new_count = COUNT.with(|count| {
        let current = count.get();
        let updated = current + increment;
        count.set(updated);
        updated
    });

    // Call the JavaScript callback function
    CALLBACK.with(|cb| {
        if let Some(ref callback) = *cb.borrow() {
            callback.call1(&JsValue::NULL, &JsValue::from(new_count)).unwrap();
        }
    });

    new_count
}

#[wasm_bindgen]
pub fn get_count() -> i32 {
    COUNT.with(|count| count.get())
}
