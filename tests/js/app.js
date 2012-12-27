function sleep(time) {
	var now = new Date().getTime(),
		later = now + (time * 1000);
	
	while(now <= later) {
		now = new Date().getTime();
	}
}
// Sleep for 2 seconds
sleep(2);
