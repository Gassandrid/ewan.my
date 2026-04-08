function frac_dim = boxcount(coordmat, maxstep, plotflag)

% frac_dim = boxcount(coordmat, maxstep, plotflag)
% calculates the fractal dimension of a set in the 2D plane 
% using the box counting method.
%
% INPUT:  coordmat    coordinates of the set points
%         maxstep     maximum step number for the boxcounting method
%         plotflag    = 0 do not plot anything
%                     = 1 plot some stuff
%
% OUTPUT: frac_dim    the estimated fractal dimension

% AUTHOR: Bernd Flemisch, IANS, University of Stuttgart
% VERSION: 1.0, 21.10.2004
% EMAIL: flemisch@ians.uni-stuttgart.de

if nargin < 2
	error(['At least two input arguments are required. Please type ' ...
	       '''help boxcount'' for usage information.']);
end
if nargin < 3
  plotflag = 0;
end

glob_llx = min(coordmat(:,1)); % lower left corner of the initial box, x-coordinate
glob_lly = min(coordmat(:,2)); % lower left corner of the initial box, y-coordinate
glob_urx = max(coordmat(:,1)); % upper right corner of the initial box, x-coordinate
glob_ury = max(coordmat(:,2)); % upper right corner of the initial box, y-coordinate
glob_width = glob_urx - glob_llx; % width of the initial box
glob_height = glob_ury - glob_lly; % height of the initial box
x = zeros(maxstep+1, 1); % data for the least squares method
y = zeros(maxstep+1, 1); % data for the least squares method

for step = 0:maxstep % loop over the subdivision steps 
  n_boxes = 0; % number of boxes containing points of the set
  n_sds = 2^step; % number of subdivisions in one direction 
  loc_width = glob_width/n_sds; % width of one box
  loc_height = glob_height/n_sds; % height of one box
  for sd_x = 1:n_sds % loop over local boxes in x-direction
    loc_llx = glob_llx + (sd_x - 1)*loc_width; % lower left corner, x-coordinate
    loc_urx = glob_llx + sd_x*loc_width; % upper right corner, x-coordinate
    % detect the set points inside the strip [loc_llx, loc_urx]:
    found_idx = find((coordmat(:,1) >= loc_llx) & (coordmat(:,1) < loc_urx)); % the indices
    found_y = coordmat(found_idx, 2); % the y-coordinates
    for sd_y = 1:n_sds % loop over local boxes in y-direction
      loc_lly = glob_lly + (sd_y - 1)*loc_height; % lower left corner, y-coordinate
      loc_ury = glob_lly + sd_y*loc_height; % upper right corner, y-coordinate
      % detect the set points inside the local box:
      inside_idx = find((found_y >= loc_lly) & (found_y < loc_ury));
      if (length(inside_idx) > 0)
	n_boxes = n_boxes + 1; % local box contains points of the set
      end
    end % loop over local boxes in y-direction
  end % loop over local boxes in x-direction
  x(step+1) = step*log(2);
  y(step+1) = log(n_boxes);
end % loop over the subdivision steps 

% To estimate the fractal dimension, the slope of the line 
% "closest" (in the least square sense) to the points (x,y) is calculated:
A = zeros(maxstep+1, 2); % set up the matrix
A(:, 1) = x; % the first column
A(:, 2) = ones(maxstep+1,1); % the second column 
[Q,R] = qr(A); % compute the QR-decomposition
c = Q'*y; % solution step 1
param = R\c; % solution step 2
frac_dim = param(1) % the estimated fractal dimension

% plotting stuff
if (plotflag) 
  % figure;
  plot(x, y, 'o', ...
       [x(1), x(end)], [param(1)*x(1) + param(2), param(1)*x(end) + param(2)], '-');
  string = sprintf('Estimated fractal dimension = %f', frac_dim);
  title(string);
  xlabel('n*ln(2)');
  ylabel('ln(n\_boxes)');
end
