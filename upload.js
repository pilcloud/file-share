const fileInput = document.querySelector('input[type="file"]');
const memberSelect = document.querySelector('select');
const uploadButton = document.querySelector('button');


uploadButton.addEventListener('click', async () => {

    const file = fileInput.files[0];
    const member = memberSelect.value;


    if (!file) {
        alert("파일을 선택해주세요.");
        return;
    }


    // 저장 위치
    const filePath = `${member}/${file.name}`;


    // Storage 업로드
    const { data, error } = await supabaseClient
        .storage
        .from('files')
        .upload(filePath, file);


    if (error) {
        alert("업로드 실패: " + error.message);
        return;
    }


    // 다운로드 주소 생성
    const { data: urlData } = supabaseClient
        .storage
        .from('files')
        .getPublicUrl(filePath);


    // Database 저장
    const { error: dbError } = await supabaseClient
        .from('files')
        .insert({
            member: member,
            filename: file.name,
            url: urlData.publicUrl
        });


    if (dbError) {
        alert("목록 저장 실패: " + dbError.message);
        return;
    }


    alert("업로드 완료!");
});

