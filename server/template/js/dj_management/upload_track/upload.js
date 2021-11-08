'use strict';
		
			;( function ( document, window, index )
			{
				// feature detection for drag&drop upload
				var isAdvancedUpload = function()
					{
						var div = document.createElement( 'div' );
						return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) ) && 'FormData' in window && 'FileReader' in window;
					}();
		
		
				// applying the effect for every form
				var forms = document.querySelectorAll( '.box' );
                var track_url = "";
                var track_banner_url="";
				Array.prototype.forEach.call( forms, function( form )
				{
					var input		 = form.querySelector( 'input[type="file"]' ),
						label		 = form.querySelector( 'label' ),
						errorMsg	 = form.querySelector( '.box__error span' ),
						restart		 = form.querySelectorAll( '.box__restart' ),
						droppedFiles = false,
						showFiles	 = function( files )
						{
							label.textContent = files.length > 1 ? ( input.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', files.length ) : files[ 0 ];
						},
						triggerFormSubmit = function()
						{
							var event = document.createEvent( 'HTMLEvents' );
							event.initEvent( 'submit', true, false );
							form.dispatchEvent( event );
						};
		
					// letting the server side to know we are going to make an Ajax request
					var ajaxFlag = document.createElement( 'input' );
					ajaxFlag.setAttribute( 'type', 'hidden' );
					ajaxFlag.setAttribute( 'name', 'ajax' );
					ajaxFlag.setAttribute( 'value', 1 );
					form.appendChild( ajaxFlag );
		
					// automatically submit the form on file select
					input.addEventListener( 'change', function( e )
					{
						showFiles( e.target.files );
		
						
						triggerFormSubmit();
		
						
					});
		
					// drag&drop files if the feature is available
					if( isAdvancedUpload )
					{
						form.classList.add( 'has-advanced-upload' ); // letting the CSS part to know drag&drop is supported by the browser
		
						[ 'drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop' ].forEach( function( event )
						{
							form.addEventListener( event, function( e )
							{
								// preventing the unwanted behaviours
								e.preventDefault();
								e.stopPropagation();
							});
						});

						[ 'dragover', 'dragenter' ].forEach( function( event )
						{
							form.addEventListener( event, function()
							{
								form.classList.add( 'is-dragover' );
							});
						});

						[ 'dragleave', 'dragend', 'drop' ].forEach( function( event )
						{
							form.addEventListener( event, function()
							{
								form.classList.remove( 'is-dragover' );
							});
						});
						form.addEventListener( 'drop', function( e )
						{
							droppedFiles = e.dataTransfer.files; // the files that were dropped
							showFiles( droppedFiles );
		
							
							triggerFormSubmit();
		
						});
					}
		
		
					// if the form was submitted
					form.addEventListener( 'submit', function( e )
					{
						// preventing the duplicate submissions if the current one is in progress
						if( form.classList.contains( 'is-uploading' ) ) return false;
		
						// form.classList.add( 'is-uploading' );
						// form.classList.remove( 'is-error' );
                        document.getElementById("container").style.display = "none";
                        document.getElementById("loading__container").style.display = "block";
		
						if( isAdvancedUpload ) // ajax file upload for modern browsers
						{
							e.preventDefault();
		
							// gathering the form data
                            
							var ajaxData = new FormData();
                            console.log('input-file : ', input.files[0])
                            ajaxData.append('file', input.files[0]);
                            console.log('ajaxData choosing: ', ajaxData);
							var dropFile;
							if( droppedFiles )
							{
								Array.prototype.forEach.call( droppedFiles, function( file )
								{
									ajaxData.append( 'file', file );
									dropFile = file;
								});
							}
                            
                            console.log('ajaxData: Drop and drag', ajaxData);
							// ajax request
                            function _(el) {
                                return document.getElementById(el);
                            }

							var ajax = new XMLHttpRequest();
							
                            

                            ajax.upload.addEventListener("progress", progressHandler, false);

                            function progressHandler(event) {
								if (droppedFiles) {
									_("track_name").innerHTML = dropFile.name;
									_("title").value = dropFile.name.split('.').slice(0, -1).join('.') + " | " + document.cookie.split(';').find(e => e.trim().split('=')[0] === 'UserFullName').split('=')[1];
								}
								else {
									_("track_name").innerHTML = input.files[0].name;
									
									_("title").value = input.files[0].name.split('.').slice(0, -1).join('.') + " | " +  document.cookie.split(';').find(e => e.trim().split('=')[0] === 'UserFullName').split('=')[1];
								}
                                
                                _("loaded_n_total").innerHTML = Math.round(event.loaded/1024/102.4) / 10 + " MB of " + Math.round(event.total /1024/102.4) / 10 + " MB đã tải lên";
                                var percent = (event.loaded / event.total) * 100;
                                _("progressBar").value = Math.round(percent);
                                // _("progressBar").innerHTML =  Math.round(percent) + "% đã tải lên... Vui lòng đợi";
                            }


							ajax.onload = function()
							{
								form.classList.remove( 'is-uploading' );
								if( ajax.status >= 200 && ajax.status < 400 )
								{
                                    
									var data = JSON.parse( ajax.responseText );
                                    if (data.status == 1) {
                                        var url = data.data.url;
                                        
                                        document.getElementById('track_url').innerHTML = url;
                                    }
									form.classList.add( data.status == 1 ? 'is-success' : 'is-error' );
									if( !data.status ) errorMsg.textContent = data.msg;
                                    track_url = data.data.url;
								}
								else alert( 'Error. Please, contact the webmaster!' );
							};
		
							ajax.onerror = function()
							{
								form.classList.remove( 'is-uploading' );
								alert( 'Error. Please, try again!' );
							};
                            
                            ajax.open( form.getAttribute( 'method' ), form.getAttribute( 'action' ), true );
							ajax.send( ajaxData );


						}
						else // fallback Ajax solution upload for older browsers
						{
							var iframeName	= 'uploadiframe' + new Date().getTime(),
								iframe		= document.createElement( 'iframe' );
		
								$iframe		= $( '<iframe name="' + iframeName + '" style="display: none;"></iframe>' );
		
							iframe.setAttribute( 'name', iframeName );
							iframe.style.display = 'none';
		
							document.body.appendChild( iframe );
							form.setAttribute( 'target', iframeName );
		
							iframe.addEventListener( 'load', function()
							{
								var data = JSON.parse( iframe.contentDocument.body.innerHTML );
								form.classList.remove( 'is-uploading' )
								form.classList.add( data.success == true ? 'is-success' : 'is-error' )
								form.removeAttribute( 'target' );
								if( !data.success ) errorMsg.textContent = data.error;
								iframe.parentNode.removeChild( iframe );
							});
						}
					});
		
		
					// restart the form if has a state of error/success
					Array.prototype.forEach.call( restart, function( entry )
					{
						entry.addEventListener( 'click', function( e )
						{
							e.preventDefault();
							form.classList.remove( 'is-error', 'is-success' );
							input.click();
						});
					});
		
					// Firefox focus bug fix for file input
					input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
					input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
		
				});
			}( document, window, 0 ));