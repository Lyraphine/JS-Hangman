(function(d){
	
	const $nav = d.querySelector('nav');
	const $btn = d.querySelector('.btn-menu');
	
	setTimeout(() => {
		$nav.classList.add('transitions-enabled');
	}, 100);

	$btn.addEventListener('click', function(){		
		$nav.classList.toggle('show');		
	});	
	
})(document);