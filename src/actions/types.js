const actionTypes = { 
  AUTH_USER: 'auth_user',  
	UNAUTH_USER:'unauth_user',
	AUTH_ERROR:'auth_error',
	SET_CURRENT_USER: 'SET_CURRENT_USER',
	PROTECTED_TEST: 'protected_test',
	GET_TEACHERS_CLASSES: 'get_teachers_classes',
	TOGGLE_CLASS_BUILDER_MODAL: 'toggle_class_builder_modal',
	ADD_NEW_CLASS_ACTION: 'add_class_action',
	GET_UPDATED_CLASS_LIST: 'get_updated_class_list',
	UPDATE_NEW_CLASS_YEAR_ACTION: 'update_new_class_year_action',
	UPDATE_NEW_CLASS_NAME_ACTION: 'update_new_class_name_action',
	UPDATE_NEW_CLASS_SUBJECT_ACTION: 'update_new_class_subject_action',
	UPDATE_NEW_CLASS_QUARTER_ACTION: 'update_new_class_quarter_action',
	UPDATE_CLASS_DATA: 'update_class_data',
	GET_ALL_STUDENTS_ACTION: 'get_all_students_action',
	TEACHER_ENTER_CLASS_ACTION: 'enter_class_action',
	TEACHER_ADD_STUDENT_TO_CLASS_ACTION: 'teacher_add_student_to_class_action',
	UPDATE_TARGET_CLASS_ACTION: 'update_target_class_action',
	GET_STUDENTS_BELONGS_TO_A_CLASS_ACTION: 'get_students_belong_to_a_class_action',
	CLASS_GO_LIVE_ACTION: 'class_go_live_action',
	GET_CLASSES_BELONG_TO_A_STUDENT_ACTION: 'get_classes_belong_to_a_student_action',
	UPDATE_STUDENT_TARGET_CLASS_ACTION: 'get_student_target_class_action',
	LISTENING_FOR_LIVE_CLASSES: 'listening_for_live_classes',
	WATCH_CLASS_GO_LIVE_ACTION: 'watch_class_go_live_action',
	TOGGLE_STUDENT_LIVE_STATUS: 'toggle_student_live_status'
}

export default actionTypes