const calculateFaceLocation = (data, currmodel) => {
    if (!data.outputs) return null;
    if (!data.outputs[0].data.regions) return null;
    //-----------------------
    let image = document.getElementById('inputimage');
    if (!image) image = document.getElementById('face_video_canvas');
    if (!image) return;
    let width = Number(image.width);
    let height = Number(image.height);
    switch(currmodel){
        case 'Matching (EyeQ)':{
            let detect_box = data.outputs[0].data.regions[0].region_info.map((item) => ({
                        leftCol: item.bounding_box.left_col * width,
                        topRow: item.bounding_box.top_row * height,
                        rightCol: width - (item.bounding_box.right_col * width),
                        bottomRow: height - (item.bounding_box.bottom_row * height)
                   }) );
            let compare_box = []
            if (image = document.getElementById('inputimage_com')){
                width = Number(image.width);
                height = Number(image.height);
                compare_box = data.outputs[0].data.regions[1].region_info.map((item) => ({
                           leftCol: item.bounding_box.left_col * width,
                           topRow: item.bounding_box.top_row * height,
                           rightCol: width - (item.bounding_box.right_col * width),
                           bottomRow: height - (item.bounding_box.bottom_row * height)
                      }) );
             }
            return {detect_box: detect_box, compare_box: compare_box};
        }
        case 'Face (EyeQ)':
        case 'Matching2':{
            return data.outputs[0].data.regions[0].region_info.map((item) => ({
                        leftCol: item.bounding_box.left_col * width,
                        topRow: item.bounding_box.top_row * height,
                        rightCol: width - (item.bounding_box.right_col * width),
                        bottomRow: height - (item.bounding_box.bottom_row * height)
                   }) );
        }
        case 'Demographics':{
            let region = data.outputs[0].data.regions[0];
            return [[{
                        leftCol: region.region_info.bounding_box.left_col * width,
                        topRow: region.region_info.bounding_box.top_row * height,
                        rightCol: width - (region.region_info.bounding_box.right_col * width),
                        bottomRow: height - (region.region_info.bounding_box.bottom_row * height)
                   }]];
        }
    }
}

export default calculateFaceLocation;
