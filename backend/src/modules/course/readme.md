<!-- ? i need to make rules in get all course playlist t should not return any playlist which is archieved, deleted and so on -->
<!--  ? need to make single request to get playlist data -->
<!-- ? need to make get all course and single courses for users and for admin, it needs separate requests  -->

<!-- ? 1) need to update create video function in order to create video need to remove uuid that will come for video uuid it should be handled in service, -->

<!-- ? 2. update order so if user does not send any order or its undefined put 0 as a order for entity and update it in video entity remove 0 and put proper order if it not equal to 0 so it can pass the validation and can be updated and other order will be reconstructed with entity function -->

<!-- ? 3. check what happened with function create video in playlist it does not update categories or add other categories, or it will just not return any category -->

<!-- ? 4 update category entity and all related function which have an errors -->

<!-- ? 5 need to make functions for modifications of video through playlist i should transfer the code from video to playlist in order to make aggregated root -->

<!-- ! need to update createPlaylist feature to create video -->

<!-- ! 6 make logic for enrolment and update all functions, which requires validation that user enrolment  -->
<!-- ! 7 need to focus on settings  -->
<!-- ! 8 need to make video player function for admin and for user -->

<!-- ! 9 need to make analytics for each module and separate analytics about user payments, enrolment and other modules -->
<!-- ! 10 need to make payment system -->

<!-- ! 11 messages -->
<!-- ! 12 notifications -->
<!-- ! 13 need to make logic for enrollment in plaulist service -->

-------------- modificaitons ------------

1 - need to update addvideo in playlist entity, when 2 same orders send even if that order far from last one for example orders form 1-10 but admin can send 100 and updating order will start from 100,so take care about sending orders only no more than the order max number

2 - need to implement enrollment especially in course playlist, it should not call service directly it should call port, and port should handle all